import { useContext } from "react";
import { MainNFTContext } from "@/views/Core/components/MainNFTContext";
import { Button } from "@nextui-org/button";

import { Label } from "@/components/ui/label";
import { Input } from "@nextui-org/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const CreateNFT = () => {
  const {
    uploadToIPFS,
    createNFT,
    price,
    name,
    description,
    setPrice,
    setName,
    setDescription,
  } = useContext(MainNFTContext);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadToIPFS(files[0]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-lg text-white font-medium bg-primary">
          + Create NFT
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-fit">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-muted-foreground">
            Seamlessly Craft NFTs
          </DialogTitle>
          <DialogDescription>
            Create One-of-a-Kind NFTs with Ease. Upload Your Artwork to IPFS.
          </DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground space-y-4 w-full max-w-md mx-auto">
          <div>
            <Label>NFT File</Label>
            <Input
              id="file-upload"
              type="file"
              required
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileUpload}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="NFT Name"
              value={name}
              onValueChange={setName}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              id="description"
              placeholder="Describe your NFT"
              value={description}
              onValueChange={setDescription}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label> Price (ETH)</Label>
            <Input
              id="price"
              type="text"
              placeholder="Price in ETH"
              value={price}
              onValueChange={setPrice}
              required
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="flex justify-center bg-primary text-white font-semibold"
              type="submit"
              onClick={() => createNFT()}
            >
              Create NFT
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNFT;
