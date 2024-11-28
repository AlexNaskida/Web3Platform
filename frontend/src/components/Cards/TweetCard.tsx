type TweetCardMessages = {
  walletAddress: string;
  content: string;
  timestamp: number;
};

const TweetCard = ({
  walletAddress,
  content,
  timestamp,
}: TweetCardMessages) => {
  const formattedDate = timestamp
    ? new Date(Number(timestamp) * 1000).toLocaleString()
    : "N/A";

  return (
    <div className="flex flex-col h-fit gap-4 justify-center items-center bg-white p-5 rounded-lg">
      <p className="text-lg">Author: {walletAddress}</p>
      <div className="bg-white">
        <p className="text-lg">Tweet: {content}</p>
      </div>
      <div className="text-xl">
        <p>Timestamp: {formattedDate} </p>
      </div>
    </div>
  );
};

export default TweetCard;
