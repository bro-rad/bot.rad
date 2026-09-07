import { expect } from "chai";
import { ethers } from "hardhat";
import { ScribeCast } from "../typechain-types";

describe("ScribeCast", function () {
  let scribecast: ScribeCast;
  const spell = "0x1234abcd";

  beforeEach(async () => {
    const scribecastFactory = await ethers.getContractFactory("ScribeCast");
    scribecast = (await scribecastFactory.deploy()) as ScribeCast;
    await scribecast.deployed();
  });

  it("emits only a commitment for scribed data", async () => {
    const [sender] = await ethers.getSigners();
    await expect(scribecast.scribe(sender.address, spell))
      .to.emit(scribecast, "result")
      .withArgs("scribe", sender.address, sender.address, ethers.utils.keccak256(spell), true);
  });

  it("rejects the zero address and self-calls", async () => {
    await expect(scribecast.scribe(ethers.constants.AddressZero, spell)).to.be.revertedWithCustomError(
      scribecast,
      "InvalidTarget",
    );
    await expect(scribecast.cast(scribecast.address, "0x")).to.be.revertedWithCustomError(scribecast, "InvalidTarget");
  });

  it("forwards a successful call and emits only the spell commitment", async () => {
    const [sender, recipient] = await ethers.getSigners();
    const value = ethers.utils.parseEther("0.01");
    const before = await ethers.provider.getBalance(recipient.address);

    await expect(scribecast.connect(sender).cast(recipient.address, spell, { value }))
      .to.emit(scribecast, "result")
      .withArgs("cast", recipient.address, sender.address, ethers.utils.keccak256(spell), true);

    expect(await ethers.provider.getBalance(recipient.address)).to.equal(before.add(value));
  });

  it("reverts when the target call fails", async () => {
    const revertingTarget = await (await ethers.getContractFactory("RevertingTarget")).deploy();
    await revertingTarget.deployed();

    await expect(scribecast.cast(revertingTarget.address, "0xffffffff")).to.be.revertedWithCustomError(
      scribecast,
      "CastFailed",
    );
  });
});
