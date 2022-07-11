import { Box, Heading, Text, Flex, CircularProgress, Grid, GridItem, Badge, IconButton } from '@chakra-ui/react';
import { Proposal } from '@thirdweb-dev/sdk';
import { useContext } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import ProposalStateLabel, { ProposalStateColor } from '../config/constants';
import CreateProposalButton from './CreateProposalButton';
import { ApiContext } from '../context/ApiContext';
import ActionsButton from './ActionsButton';

const ProgressCircleTemplate = () => (
  <Flex justifyContent='center' alignItems='center'>
    <CircularProgress isIndeterminate color='blue.500' boxSize={200} />
  </Flex>
);

const NoProposalsTemplate = () => (
  <Flex justifyContent='center' alignItems='center'>
    <Text px={8}>You dont have proposals yet, start create your first proposal</Text>
    <CreateProposalButton />
  </Flex>
);

const ProposalsTemplate = () => {
  const { proposals, loadProposals, bigNumberToStringFilter } = useContext(ApiContext);
  return (
    <Grid templateColumns='repeat(3, 1fr)' gap={6}>
      {proposals.map((proposal: Proposal, index: number) => (
        <GridItem key={index}>
          <Box key={index} p={5} shadow='md' borderWidth='1px' mb={5} borderRadius={10}>
            <Heading fontSize='xl'>
              Status:{' '}
              <Badge variant='solid' ml='1' fontSize='0.8em' colorScheme={ProposalStateColor[proposal.state]}>
                {ProposalStateLabel[proposal.state]}
              </Badge>
              <IconButton
                ml={3}
                aria-label='Refresh'
                colorScheme='green'
                size='sm'
                onClick={loadProposals}
                icon={<FiRefreshCw />}
              />
            </Heading>
            <Text mt={4}>Proposal: {proposal.description} </Text>
            <Text mt={4}>Proposed By: {proposal.proposer}</Text>
            <Text mt={4}>For: {bigNumberToStringFilter(proposal.votes[1].count)} </Text>
            <Text mt={4}>Against: {bigNumberToStringFilter(proposal.votes[0].count)}</Text>
            <Text mt={4}>Abstained: {bigNumberToStringFilter(proposal.votes[2].count)} </Text>

            <Box>
              <ActionsButton voteStatus={proposal.state} proposalId={proposal.proposalId} />
            </Box>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

const ProposalList = () => {
  const { isLoading, proposals } = useContext(ApiContext);

  return (
    <>
      <Flex p={5} justifyContent='center'>
        {isLoading ? <ProgressCircleTemplate /> : proposals.length ? <ProposalsTemplate /> : <NoProposalsTemplate />}
      </Flex>
    </>
  );
};

export default ProposalList;
