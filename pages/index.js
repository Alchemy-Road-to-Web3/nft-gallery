import { useState } from "react";

import Layout from "../components/Layout";
import NFTCard from "../components/NftCard";
import PaginationBar from "../components/PaginationBar";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKeys, setPageKeys] = useState([""]);

  const fetchNFTs = async (e) => {
    e.preventDefault();

    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;
    const fetchURL = !collectionAddress
      ? `${baseURL}?owner=${walletAddress}`
      : `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;

    try {
      const nfts = await fetch(fetchURL, {
        method: "GET",
      }).then((data) => data.json());

      if (nfts) {
        setNFTs(nfts.ownedNfts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTsForCollection = async (e, startToken = "", pageIndex = 0) => {
    e.preventDefault();

    if (collectionAddress) {
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=true&startToken=${startToken}`;

      try {
        const nfts = await fetch(fetchURL, {
          method: "GET",
        }).then((data) => data.json());

        if (nfts) {
          if (nfts.nextToken) {
            setPageKeys((prevKeys) => {
              const newKeys = [...prevKeys];
              newKeys[pageIndex + 1] = nfts.nextToken;

              return newKeys;
            });
          }
          setNFTs(nfts.nfts);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onClickPage = (e, pageIndex) => {
    if (currentPage === pageIndex) return;

    try {
      fetchNFTsForCollection(e, pageKeys[pageIndex], pageIndex);
      setCurrentPage(pageIndex);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl text-center mb-6 sm:mb-8 text-brand font-semibold tracking-wide">
        NFT Gallery
      </h1>

      <form className="max-w-lg mx-auto flex flex-col">
        <input
          type="text"
          placeholder="Add your wallet address"
          className="w-full mb-4"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={walletAddress}
          disabled={fetchForCollection}
        />
        <input
          type="text"
          placeholder="Add the collection address"
          className="w-full mb-4"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collectionAddress}
        />
        <label className="flex justify-center items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            checked={fetchForCollection}
          ></input>
          Fetch for collection
        </label>
        <button
          disabled={!walletAddress && !collectionAddress}
          onClick={collectionAddress ? fetchNFTsForCollection : fetchNFTs}
          className="disabled:bg-slate-500 disabled:border-slate-500 disabled:text-gray-50
          disabled:hover:text-gray-50 text-white bg-brand px-4 py-2 rounded-md w-full transition-effect
          hover:text-brand hover:bg-white border border-brand font-semibold"
        >
          Fetch NFTs
        </button>
      </form>

      {pageKeys.length > 1 && (
        <PaginationBar
          currentPage={currentPage}
          pageKeys={pageKeys}
          onClickPage={onClickPage}
          className="border-t"
        />
      )}

      <div className="grid grid-cols-3 gap-8 mt-6">
        {!!NFTs.length &&
          NFTs.map((nft, i) => {
            return <NFTCard nft={nft} key={`${nft.tokenUri.raw}-${i}-${nft.id.tokenId}`}></NFTCard>;
          })}
      </div>

      {pageKeys.length > 1 && (
        <PaginationBar
          currentPage={currentPage}
          pageKeys={pageKeys}
          onClickPage={onClickPage}
          className="border-t"
        />
      )}
    </Layout>
  );
}
