var cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

//Utils to fill the str
function leftPad (str, len, ch) {
	// convert `str` to `string`
	str = str + '';
	// `len` is the `pad`'s length now
	len = len - str.length;
	// doesn't need to pad
	if (len <= 0) return str;
	// `ch` defaults to `' '`
	if (!ch && ch !== 0) ch = ' ';
	// convert `ch` to `string`
	ch = ch + '';
	// cache common use cases
	if (ch === ' ' && len < 10) return cache[len] + str;
	// `pad` starts with an empty string
	var pad = '';
	// loop
	while (true) {
		// add `ch` to `pad` if `len` is odd
		if (len & 1) pad += ch;
		// divide `len` by 2, ditch the remainder
		len >>= 1;
		// "double" the `ch` so this operation count grows logarithmically on `len`
		// each time `ch` is "doubled", the `len` would need to be "doubled" too
		// similar to finding a value in binary search tree, hence O(log(n))
		if (len) ch += ch;
		// `len` is 0, exit the loop
		else break;
	}
	// pad `str`!
	return pad + str;
}

//Function to send the mc from source account to destination account
//This function requires an unlocked source account
//Input
//src:     string or a variable 
//tgtaddr: 
//amount:  amount to send, a number in mc
//strData: string data, can be NULL
function sendtx(src, tgtaddr, amount, strData) {
		
	chain3.mc.sendTransaction(
		{
			from: src,
			value:chain3.toSha(amount,'mc'),
			to: tgtaddr,
			gas: "200000",//min 1000
			gasPrice: chain3.mc.gasPrice,
			data: strData
		}, function (e, transactionHash){
            if (!e) {
                 console.log('Transaction hash: ' + transactionHash);
            }
         });
		
	console.log('sending from:' + 	src + ' to:' + tgtaddr  + ' amount:' + amount + ' with data:' + strData);

}

//Send function unlock the source account and
//send the input value to the target account
function Send(src, passwd, target, value)
{
	chain3.personal.unlockAccount(src, passwd, 0);
	sendtx(src, target, value, '' );
	
}
//src: source address
//passwd: passwd to unlock src address
//target: target address
//value: amount to be sent
//block: amount to be send in this block, this number should be the actual block number. 
//revertable: if revertable
//Example:
// FutureSend(src, 'password', des, 1.0, 15000, 0)
// A 1.0 mc will be send at block 15000 from src to des
// Note: if the block is lower than the current block number, this transaction will fail.
//
function FutureSend(src, passwd, target, value, block, revertable)
{
	//address must start with 0x
	if( !(target.substring(0,2) == "0x" || target.substring(0,2) == "0X" ))
	{	
		console.log("error target address format, expect 0x");
		return;
	}

	
	var amt = leftPad(chain3.toHex(chain3.toSha(value, 'mc')).slice(2).toString(16),64,0);
	var blkstr = leftPad(chain3.toHex(block).slice(2).toString(16),64,0);
	var strtgt = leftPad(target.substring(2),64,0);
	
	var revertstr = leftPad(chain3.toHex(revertable).slice(2).toString(16),64,0);
	
	var strData = "0xc8d0d29a";
	strData = strData + blkstr + strtgt + amt + revertstr;

	chain3.personal.unlockAccount(src, passwd, 0);
	var src = src;
	var cntaddr = "0x0000000000000000000000000000000000000065";
	sendtx(src, cntaddr, '0', strData );
	
}


//A simple tool to check all the account balances.
function checkBalance() {
    var totalBal = 0;
    for (var acctNum in mc.accounts) {
        var acct = mc.accounts[acctNum];
        var acctBal = chain3.fromSha(mc.getBalance(acct), "mc");
        totalBal += parseFloat(acctBal);
        console.log("  mc.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " mc");
    }
};
