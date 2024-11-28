import { contract } from "../../constants/constant";
import { Dispatch, SetStateAction } from "react";

type TweetDictionaryItem = {
  0: string;
  1: string;
  2: bigint;
  author: string;
  content: string;
  timestamp: number;
};

type HandleTweetCreationArgs = {
  walletAddress: string;
  tweetMessage: string;
  setTweetDictionary: Dispatch<SetStateAction<TweetDictionaryItem[]>>;
  setTweetMessage: Dispatch<SetStateAction<string>>;
};

export const handleTweetCreation = async ({
  walletAddress,
  tweetMessage,
  setTweetDictionary,
  setTweetMessage,
}: HandleTweetCreationArgs) => {
  try {
    const response = await contract.methods
      .createMessage(tweetMessage)
      .send({ from: walletAddress });

    console.log("Response: ", response);

    const allTweets: TweetDictionaryItem[] = await contract.methods
      .getAllMessages(walletAddress)
      .call();

    setTweetDictionary(allTweets);
    setTweetMessage("");
  } catch (error) {
    console.log(error);
  }
};

// export const handleTweetCreation = async (
//   walletAddress: string,
//   tweet: string
// ) => {
//   const [tweetDictionary, setTweetDictionary] = useState<dictionaryItem[]>([]);
//   try {
//     // const gasLimit = await contract.methods
//     //   .createTweet(tweet)
//     //   .estimateGas({ from: walletAddress });

//     const response = await contract.methods
//       .createTweet(tweet)
//       .send({ from: walletAddress });

//     console.log(response);
//     const allTweets: dictionaryItem[] = await contract.methods
//       .getAllTweets(walletAddress)
//       .call();
//     console.log(allTweets);
//     setTweetDictionary(allTweets);
//   } catch (error) {
//     console.log(error);
//   }
// };
