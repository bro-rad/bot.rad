//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * Cast into call and event data or Scribe into event data.
 */

contract ScribeCast {
	string public constant NAME = "ScribeCast";
	string public constant SYMBOL = "SCRAISBTE";
	string private constant CAST = "cast";
	string private constant SCRIBE = "scribe";

	bool private locked;

	error InvalidTarget();
	error ReentrantCall();
	error CastFailed();

	event result(string action, address indexed to, address indexed from, bytes32 spellCommitment, bool success);

	function cast(address payable to, bytes calldata spell) external payable {
		if (to == address(0) || to == address(this)) revert InvalidTarget();
		if (locked) revert ReentrantCall();
		locked = true;
		(bool success, ) = to.call{ value: msg.value }(spell);
		locked = false;

		if (!success) revert CastFailed();
		emit result(CAST, to, msg.sender, keccak256(spell), true);
	}

	function scribe(address to, bytes calldata spell) external {
		if (to == address(0)) revert InvalidTarget();
		emit result(SCRIBE, to, msg.sender, keccak256(spell), true);
	}
}
