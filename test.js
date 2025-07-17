// Import sentiment library properly
import Sentiment from 'sentiment';

export function createSentimentAnalyzer() {
    return {
        analyze: function(text) {
            try {
                const sentiment = new Sentiment();
                return sentiment.analyze(text);
            } catch (error) {
                console.error('Error using sentiment library:', error);
                console.warn('Sentiment library error, using fallback');
                return this.fallbackAnalyze(text);
            }
        },
        
        // ...existing code...
        fallbackAnalyze: function(text) {
            // Simple fallback sentiment analysis
            const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry', 'sad', 'horrible', 'worst'];
            const positiveWords = ['good', 'great', 'amazing', 'love', 'happy', 'excellent', 'wonderful', 'best', 'fantastic'];
            
            const words = text.toLowerCase().split(/\s+/);
            let score = 0;
            const negative = [];
            const positive = [];
            
            words.forEach(word => {
                if (negativeWords.includes(word)) {
                    score -= 1;
                    negative.push(word);
                } else if (positiveWords.includes(word)) {
                    score += 1;
                    positive.push(word);
                }
            });
            
            return {
                score,
                comparative: score / words.length,
                tokens: words,
                words: words,
                positive,
                negative
            };
        }
    };
}

export function analyzeSentiment() {
    const text = document.getElementById('textInput').value;
    if (!text.trim()) {
        alert('Please enter some text to analyze');
        return;
    }

    const sentimentAnalyzer = createSentimentAnalyzer();
    const result = sentimentAnalyzer.analyze(text);
    
    const resultsDiv = document.getElementById('results');
    const outputDiv = document.getElementById('output');
    
    let sentimentLabel = 'Neutral';
    let sentimentClass = 'neutral';
    
    if (result.score > 0) {
        sentimentLabel = 'Positive';
        sentimentClass = 'positive';
    } else if (result.score < 0) {
        sentimentLabel = 'Negative';
        sentimentClass = 'negative';
    }
    
    outputDiv.innerHTML = `
        <p><strong>Overall Sentiment:</strong> <span class="${sentimentClass}">${sentimentLabel}</span></p>
        <p><strong>Score:</strong> ${result.score}</p>
        <p><strong>Comparative Score:</strong> ${result.comparative.toFixed(3)}</p>
        <p><strong>Positive words:</strong> ${result.positive.join(', ') || 'None'}</p>
        <p><strong>Negative words:</strong> ${result.negative.join(', ') || 'None'}</p>
        <p><strong>Word count:</strong> ${result.words.length}</p>
        <p><strong>Tokens:</strong> ${result.tokens.join(', ')}</p>
    `;
    
    resultsDiv.style.display = 'block';
    
    // Test if we should trigger replacement
    if (result.score < 0) {
        console.log('🎯 This text would trigger sentiment replacement!');
    } else {
        console.log('✅ This text does not require replacement.');
    }
}