export type SiteConfig = typeof siteConfig;

export const baseUrl = 'https://app.mande.network/subgraphs/name/TrustDrops';
export const myStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(where: {staker_: {id: $address}}) {\n    amount\n    credScore\n    candidate {\n      id\n      __typename\n    }\n    __typename\n  }\n}';
export const receivedStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(where: {candidate_: {id: $address}}) {\n    amount\n    credScore\n    staker {\n      id\n      __typename\n    }\n    __typename\n  }\n}';

export const siteConfig = {
  name: 'Tek Zeki Sensin',
};
