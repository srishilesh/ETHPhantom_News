pragma solidity ^0.5.0;

contract Fake_news{
    uint public news_count = 0;
    struct News{
        uint id;
        string data;
        bool completed;
    }
    mapping (uint => News) public detect_fake;

    event NewsCreated(
        uint id,
        string content,
        bool completed
    );

    event NewsCompleted(
    uint id,
    bool completed
  );
    constructor() public{
        createNews("CryptoCurrencies are banned in India");
    }
    function createNews(string memory _data) public{
        news_count ++;
        detect_fake[news_count] = News(news_count,_data,false);
        emit NewsCreated(news_count, _data,false);
    }
    function toggleCompleted(uint _id) public {
    News memory _news = detect_fake[_id];
    _news.completed = !_news.completed;
    detect_fake[_id] = _news;
    emit NewsCompleted(_id, _news.completed);
    }


}