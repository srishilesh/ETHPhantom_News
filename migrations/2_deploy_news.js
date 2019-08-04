const Fake_news = artifacts.require("./Fake_news.sol");

module.exports = function(deployer) {
  deployer.deploy(Fake_news);
};
