import { Flex, Button } from '@chakra-ui/react';
import { useAddress, useToken, useVote } from '@thirdweb-dev/react';
import { ProposalState, VoteType } from '@thirdweb-dev/sdk';
import { useContext, useEffect, useState } from 'react';
import { BsEmojiNeutralFill, BsEmojiLaughingFill, BsEmojiFrownFill } from 'react-icons/bs';

import { AiFillCheckCircle } from 'react-icons/ai';
import { TOKEN_RINKEBY_CONTRACT, VOTE_RINKEBY_CONTRACT } from '../config/contracts';
import { BigNumber } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { ApiContext } from '../context/ApiContext';

const ActionsButton = ({ voteStatus, proposalId }: { voteStatus: ProposalState; proposalId: BigNumber }) => {
  const vote = useVote(VOTE_RINKEBY_CONTRACT);
  const token = useToken(TOKEN_RINKEBY_CONTRACT);
  const { loadProposals } = useContext(ApiContext);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(true);

  const address = useAddress();

  useEffect(() => {
    vote!.hasVoted(proposalId.toString(), address).then((isVoterRes) => {
      setIsVoted(isVoterRes);
    });
  }, []);

  const voteClicked = async (voteType: VoteType) => {
    const delegation = await token?.getDelegationOf(address!);
    if (delegation === AddressZero) {
      await token?.delegateTo(address!);
    }
    vote
      ?.vote(proposalId.toString(), voteType)
      .then((res) => {
        loadProposals();
      })
      .finally(() => setIsVoteLoading(false));
  };

  const executeClicked = () => {
    setIsVoteLoading(true);
    vote
      ?.execute(proposalId.toString())
      .then((res) => {
        loadProposals();
      })
      .finally(() => setIsVoteLoading(false));
  };

  if (voteStatus === ProposalState.Active && !isVoted) {
    return (
      <Flex gap={3}>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.For)}
          leftIcon={<BsEmojiLaughingFill />}
          colorScheme='green'
          size='sm'
        >
          Approve
        </Button>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.Against)}
          leftIcon={<BsEmojiFrownFill />}
          colorScheme='red'
          size='sm'
        >
          Against
        </Button>
        <Button
          isLoading={isVoteLoading}
          onClick={() => voteClicked(VoteType.Abstain)}
          leftIcon={<BsEmojiNeutralFill />}
          colorScheme='yellow'
          size='sm'
        >
          Abstain
        </Button>
      </Flex>
    );
  } else if (voteStatus === ProposalState.Succeeded) {
    return (
      <Button
        isLoading={isVoteLoading}
        onClick={() => executeClicked()}
        leftIcon={<AiFillCheckCircle />}
        colorScheme='blue'
        size='sm'
      >
        Execute
      </Button>
    );
  }

  return <></>;
};

export default ActionsButton;
