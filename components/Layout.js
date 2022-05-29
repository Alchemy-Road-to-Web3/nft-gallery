import Head from "next/head";

export default function Layout({ title, keywords, description, children, className = "" }) {
  return (
    <div className="font-poppins bg-brand/50 min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <div
        className={`text-darkgrey overflow-x-hidden min-h-screen max-w-6xl mx-auto bg-white shadow-lg ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

Layout.defaultProps = {
  title: "Road to Web3 | NFT Gallery",
  description: "View your NFTs with our beautiful gallery UI!",
  keywords: "blockchain, nft, roadtoweb3, web3",
};
