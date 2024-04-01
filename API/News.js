import ElementsBuilder from '../elements-builder.js';

class News {
    constructor() {
        this.newsChannelNames = [];
        this.allowedChannelIDs = ["the-times-of-india", "abc-news-au", "bbc-news", "bbc-sport", "cnn", "usa-today", "time", "the-hindu"];
        this.fetchNewsChannelNames();
    }

    fetchNewsChannelNames = () => {
        fetch('https://newsapi.org/v2/sources?apiKey=a0c28fe771af45c68fa5baac4ab1c75f')
            .then(response => response.json())
            .then(data => {
                    this.newsChannelNames = data['sources'].filter(channel => this.allowedChannelIDs.includes(channel.id)); 
                    this.ElementsBuilder = new ElementsBuilder();
            })
            .catch(error => {
                console.log(error);
            })
    }

    fetchNewsForSelectedChannel = (channelId) => {
        document.getElementById('main').innerHTML = '';
        document.getElementById('main').classList.add('loader');

        fetch('https://newsapi.org/v1/articles?source=' + channelId + '&apiKey=a0c28fe771af45c68fa5baac4ab1c75f')
            .then(response => response.json())
            .then(data => {
                let newsRecords = [];
                newsRecords[channelId] = data['articles'];
                this.ElementsBuilder.setNewsRecords(newsRecords[channelId], channelId);
                document.getElementById('main').classList.remove('loader');
            })
            .catch(error => {
                console.log(error);
            })
    }

    fetchHeaderFooterData = () => {
        fetch('./elements.json')
            .then(response => response.json())
            .then(data => {
                this.ElementsBuilder.setHeaderFooterData(data);
            })
    }
}

export default News;
