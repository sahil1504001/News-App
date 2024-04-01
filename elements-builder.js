import News from './API/News.js';
let news = new News();

export default class ElementsBuilder {
    constructor() {
        this.elementsBuilder = news.elementsBuilder;
        this.newsChannelSelectElement;
        this.newsChannelElements = [];
        this.newsHtmlData = [];
        this.headerFooterData;
        this.headerFooterRendered = false;
        this.newsChannelNames = news.newsChannelNames;
        this.selectedChannelObject = this.newsChannelNames[0];
        this.newsChannelNames.map(category => {
            this.newsChannelElements.push({ 'targetElement': 'news-category', 'elementName': 'option', 'elementAttributes': [{ 'name': 'value', 'value': category.name }, { 'name': 'title', 'value': category.id }], 'innerHTML': category.name, 'nestedElements': null });
        });
        news.fetchHeaderFooterData();
        news.fetchNewsForSelectedChannel(this.newsChannelNames[0].id);
        this.registerModalbackdrop();
    }

    registerModalbackdrop = () => {
        window.onclick = (event) => {
            let modal = document.getElementById("newsModal");
            if (event.target == modal) 
              modal.style.display = "none";
        }
    }

    setNewsRecords = (newsRecordsFromAPI, currentChannelId) => {
        this.newsRecords = newsRecordsFromAPI;
        this.onCategoryChange();
    }

    setHeaderFooterData = (headerFooterData) => {
        this.headerFooterData = headerFooterData;
    }

    createElement = (elementData) => {
        let element = document.createElement(elementData.elementName);

        elementData.elementAttributes.map((attributes) => {
            element.setAttribute(attributes.name, attributes.value);
        });

        if(elementData.innerHTML)
            element.appendChild(document.createTextNode(elementData.innerHTML));
        document.getElementById(elementData.targetElement).appendChild(element);

        if(elementData.nestedElements)
            elementData.nestedElements.map((elementData) => {
                this.createElement(elementData);
            });
    }
    
    loadHeader = () => {
        this.state.header.map((elementData) => {
            this.createElement(elementData);
        });
    }

    loadFooter = () => {
        this.state.footer.map((elementData) => {
            this.createElement(elementData);
        });
    }

    loadMain = () => {
        this.state.main.map((elementData) => {
            this.createElement(elementData);
        });
        document.getElementById("news-category").selectedIndex = this.newsChannelNames.indexOf(this.selectedChannelObject);
        document.getElementById('line-break-id' + (this.newsRecords.length - 1)).classList.add('news-element-last');
    }

    onCategoryChange = (() => {
        this.newsHtmlData = [];
        
        this.newsRecords.map((data, index) => { 
            this.newsHtmlData.push({ 
                'targetElement': 'body-content-id', 'elementName': 'div', 'elementAttributes': [{ 'name': 'class', 'value': 'news-element' }, { 'name': 'id', 'value': 'news-element-id' + index }, { 'name': 'news-index', 'value': index }], 'innerHTML': null,
                'nestedElements': [
                    { 
                        'targetElement': 'news-element-id' + index, 'elementName': 'div', 'elementAttributes': [{ 'name': 'class', 'value': 'news-element-image' }, { 'name': 'id', 'value': 'news-element-image-id' + index }], 'innerHTML': null, 
                        'nestedElements': [
                            { 'targetElement': 'news-element-image-id' + index, 'elementName': 'img', 'elementAttributes': [{ 'name': 'src', 'value': data.urlToImage }, { 'name': 'alt', 'value': 'INF - Image Not Found' }], 'innerHTML': null, 'nestedElements': null }
                        ]
                    },
                    { 
                        'targetElement': 'news-element-id' + index, 'elementName': 'div', 'elementAttributes': [{ 'name': 'class', 'value': 'news-element-body' }, { 'name': 'id', 'value': 'news-element-body-id' + index }], 'innerHTML': null, 
                        'nestedElements': [
                            { 'targetElement': 'news-element-body-id' + index, 'elementName': 'h3', 'elementAttributes': [], 'innerHTML': data.title, 'nestedElements': null },
                            { 'targetElement': 'news-element-body-id' + index, 'elementName': 'small', 'elementAttributes': [], 'innerHTML': new Date(data.publishedAt).toLocaleString('en-US', { timeZone: 'Indian/Christmas' }), 'nestedElements': null },
                            { 
                                'targetElement': 'news-element-body-id' + index, 'elementName': 'p', 'elementAttributes': [], 
                                'innerHTML': data.description, 
                                'nestedElements': null 
                            },
                            { 'targetElement': 'news-element-body-id' + index, 'elementName': 'button', 'elementAttributes': [{ 'name': 'class', 'value': 'news-element-button' }, { 'name': 'id', 'value': 'news-element-button-id' + index }, { 'name': 'title', 'value': index }], 'innerHTML': 'Continue Reading', 'nestedElements': null }
                        ] 
                    },
                ]
            },
            { 'targetElement': 'body-content-id', 'elementName': 'hr', 'elementAttributes': [{ 'name': 'id', 'value': 'line-break-id' + index }], 'innerHTML': null, 'nestedElements': null });
        });
        
        this.setupElementsData();
        this.loadMain();
        if(!this.headerFooterRendered) {
            this.loadHeader();
            this.loadFooter();
            this.headerFooterRendered = true;
        }
        this.newsChannelSelectElement = document.getElementById('news-category');
        this.newsChannelSelectElement.addEventListener('change', () => {
            this.selectedChannelObject = this.newsChannelNames.find(channel => channel.name === this.newsChannelSelectElement.value );
            news.fetchNewsForSelectedChannel(this.selectedChannelObject.id);
        });  

        this.subscribeButtonElement = document.getElementById('news-subcribe-button');
        this.subscribeButtonElement.addEventListener('click', () => {
            this.subscribeToNews();
        }); 

        document.getElementById('modal-header-close-id').addEventListener('click', () => {
            this.modalToggle('close');
        });

        for(let i = 0; i < this.newsRecords.length; i++) {
            document.getElementById('news-element-button-id' + i).addEventListener('click', (e) => {
                this.modalToggle(e.target);
            })
        }
    });

    setupElementsData = () => {
        this.state = {   
            ...this.headerFooterData,
            'main': [
                { 
                    'targetElement': 'main', 'elementName': 'div', 'elementAttributes': [{ 'name': 'class', 'value': 'body-content' }, { 'name': 'id', 'value': 'body-content-id' }], 'innerHTML': null,
                    'nestedElements': [...this.newsHtmlData]
                },
                {
                    'targetElement': 'main', 'elementName': 'div', 'elementAttributes': [{ 'name': 'class', 'value': 'body-filter' }, { 'name': 'id', 'value': 'body-filter-id' }], 'innerHTML': null,
                    'nestedElements': [
                        { 
                            'targetElement': 'body-filter-id', 'elementName': 'div', 'elementAttributes': [{ 'name': 'id', 'value': 'select-category-div-id' }], 'innerHTML': null, 
                            'nestedElements': [
                                { 'targetElement': 'select-category-div-id', 'elementName': 'h4', 'elementAttributes': [], 'innerHTML': 'SELECT CHANNEL', 'nestedElements': null },
                                { 
                                    'targetElement': 'select-category-div-id', 'elementName': 'select', 'elementAttributes': [{ 'name': 'id', 'value': 'news-category' }], 'innerHTML': null, 
                                    'nestedElements': [...this.newsChannelElements] //options 
                                }
                            ] 
                        },
                        { 
                            'targetElement': 'body-filter-id', 'elementName': 'div', 'elementAttributes': [{ 'name': 'id', 'value': 'email-subscribe-div-id' }], 'innerHTML': null, 
                            'nestedElements': [
                                { 'targetElement': 'email-subscribe-div-id', 'elementName': 'h4', 'elementAttributes': [], 'innerHTML': 'SUBSCRIBE', 'nestedElements': null },
                                { 
                                    'targetElement': 'email-subscribe-div-id', 'elementName': 'div', 'elementAttributes': [{'name': 'class', 'value': 'subscribe-elements'}, { 'name': 'id', 'value': 'subscribe-input-button-elements-id' }], 'innerHTML': null, 
                                    'nestedElements': [
                                        { 'targetElement': 'subscribe-input-button-elements-id', 'elementName': 'input', 'elementAttributes': [{ 'name': 'id', 'value': 'news-subcribe-email' }, { 'name': 'type', 'value': 'email' }, { 'name': 'placeholder', 'value': 'Enter Address' }], 'innerHTML': null, 'nestedElements': null },
                                        { 'targetElement': 'subscribe-input-button-elements-id', 'elementName': 'button', 'elementAttributes': [{ 'name': 'id', 'value': 'news-subcribe-button' }, { 'name': 'type', 'value': 'submit' }], 'innerHTML': 'Subscribe', 'nestedElements': null },
                                    ]
                                },
                                { 'targetElement': 'email-subscribe-div-id', 'elementName': 'div', 'elementAttributes': [{'name': 'class', 'value': 'alert'}, {'name': 'id', 'value': 'alert-box-id'}], 'innerHTML': null, 'nestedElements':  null }
                            ] 
                        },
                    ]
                }
            ]
        }
    }

    subscribeToNews = () => {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let inputEmail = document.getElementById('news-subcribe-email');
        let emailSubscriptionData = [];
        let emailAlreadyExistsFlag = false;
        let alertElement = document.getElementById('alert-box-id');
        if(!inputEmail.value) {
            alertElement.innerHTML = "Enter email to subscribe";
            alertElement.classList.add('alert-danger');
            this.callSetTimeout(alertElement);
            inputEmail.focus();
            return false;
        }
        if(inputEmail.value.match(mailformat)) {
            if(localStorage.getItem("emailSubscriptionData") !== null) {
                emailSubscriptionData = JSON.parse(localStorage.getItem("emailSubscriptionData"));
                emailSubscriptionData.map(email => {
                    if(email === inputEmail.value) {
                        alertElement.innerHTML = "Already subscribed";
                        inputEmail.value = '';
                        alertElement.classList.add('alert-danger');
                        emailAlreadyExistsFlag = true;
                    }
                });
            }
            if(!emailAlreadyExistsFlag) {
                emailSubscriptionData.push(inputEmail.value);
                localStorage.setItem("emailSubscriptionData", JSON.stringify(emailSubscriptionData));
                alertElement.innerHTML = "Subscribed to news!";
                alertElement.classList.add('alert-success');
                inputEmail.value = '';
            }
        }
        else {
            alertElement.innerHTML = "Invalid email address!";
            alertElement.classList.add('alert-danger');
        }
        this.callSetTimeout(alertElement);
    }

    callSetTimeout = (alertElement) => {
        new Promise(resolve => (
            setTimeout(() => { 
                alertElement.innerHTML = "";
                alertElement.classList.remove('alert-success');
                alertElement.classList.remove('alert-danger');
                resolve();
            }, 2000)
        ));
    }

    modalToggle = (index) => {
        if(index === "close") {
            document.getElementById('newsModal').style.display = 'none';
        }
        else {
            let selectedNews = this.newsRecords[index.title];
            document.getElementById('modal-header-news-title-id').innerHTML =selectedNews.title;
            document.getElementById('modal-body-date-id').innerHTML = new Date(selectedNews.publishedAt).toLocaleString('en-US', { timeZone: 'Indian/Christmas' })
            document.getElementById('modal-body-description-id').innerHTML = selectedNews.description;
            document.getElementById('newsModal').style.display = 'block';
        }
    }
}