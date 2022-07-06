const ora = require("ora");

function sleep(n) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, n);
	});
}

async function loading(message, fn, ...args) {
	const spinner = ora(message);
	spinner.start(); //
	try {
		let executeRes = await fn(...args);
		spinner.succeed();
		return executeRes;
	} catch (error) {
		spinner.fail("request fail, reTrying");
		await sleep(1000);
		return loading(message, fn, ...args);
	}
}

module.exports = {
	loading,
};
