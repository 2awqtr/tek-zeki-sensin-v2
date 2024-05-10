export type SiteConfig = typeof siteConfig;

export const baseUrl = 'https://app.mande.network/subgraphs/name/TrustDrops';

export const myStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(first:1000, where: {staker_: {id: $address}}) {\n    amount\n    credScore\n    candidate {\n      id\n      __typename\n    }\n    __typename\n  }\n}';

export const receivedStakesQuery =
  'query GetStakesSent($address: String!) {\n  stakes(first:1000, where: {candidate_: {id: $address}}) {\n    amount\n    credScore\n    staker {\n      id\n      __typename\n    }\n    __typename\n  }\n}';

export const rues = '0xD5B5dE10256Fc33DA9c576eB3B0DC73A16E8aBcc';

export const siteConfig = {
  name: 'Tek Zeki Sensin',
};
