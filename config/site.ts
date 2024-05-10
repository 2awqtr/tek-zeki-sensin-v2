export type SiteConfig = typeof siteConfig;

export const baseUrl = 'https://app.mande.network/subgraphs/name/TrustDrops';

export const myStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(first:1000, where: {staker_: {id: $address}}) {\n    amount\n    credScore\n    candidate {\n      id\n      __typename\n    }\n    __typename\n  }\n}';

export const receivedStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(first:1000, where: {candidate_: {id: $address}}) {\n    amount\n    credScore\n    staker {\n      id\n      __typename\n    }\n    __typename\n  }\n}';

export const rues = '0xd5b5de10256fc33da9c576eb3b0dc73a16e8abcc';

export const siteConfig = {
  name: 'Tek Zeki Sensin',
};
