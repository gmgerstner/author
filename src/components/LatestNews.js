import React from 'react';
import ReactMarkdown from 'react-markdown';
import newsData from '../data/news.json';

function LatestNews() {
    return (
        <div>
            <h2>Latest News</h2>
            {newsData.newsItems.map((newsItem) => (
                <div key={newsItem.id} style={{ 
                    borderLeft: '4px solid #667eea', 
                    paddingLeft: '20px', 
                    marginBottom: '20px' 
                }}>
                    <h3 style={{ color: '#764ba2', marginBottom: '10px' }}>
                        {newsItem.title}
                    </h3>
                    {newsItem.date && (
                        <p style={{ 
                            marginBottom: '10px', 
                            fontSize: '0.9rem', 
                            color: '#666',
                            fontStyle: 'italic'
                        }}>
                            {newsItem.date}
                        </p>
                    )}
                    <div className="markdown-content">
                        <ReactMarkdown>{newsItem.content}</ReactMarkdown>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LatestNews;
