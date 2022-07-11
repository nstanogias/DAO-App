import { createContext, ReactNode, useEffect, useState } from 'react';
import { Proposal } from '@thirdweb-dev/sdk';
import { useVote } from '@thirdweb-dev/react';
import { VOTE_RINKEBY_CONTRACT } from '../config/contracts';
import { BigNumber, ethers } from 'ethers';

export const ApiContext = createContext<any>(null);

type Props = {
  children: ReactNode;
};

const ApiProvider = ({ children }: Props) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const vote = useVote(VOTE_RINKEBY_CONTRACT);

  const loadProposals = () => {
    setIsLoading(true);
    vote?.getAll().then((proposals: Proposal[]) => {
      setProposals(proposals);
      setIsLoading(false);
      console.log(proposals);
    });
  };

  const bigNumberToStringFilter = (bn: BigNumber) => ethers.utils.formatEther(bn);

  useEffect(() => {
    loadProposals();
  }, []);

  const value = {
    proposals,
    setProposals,
    isLoading,
    bigNumberToStringFilter,
    loadProposals,
  };

  return (
    <>
      <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
    </>
  );
};

export default ApiProvider;
