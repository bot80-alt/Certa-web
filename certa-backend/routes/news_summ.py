from newspaper import Article
import nltk
import os
import requests
from urllib.parse import urlparse

# Configure NLTK data path at module level
nltk_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nltk_data')
nltk.data.path.insert(0, nltk_data_dir)

print(f"Looking for nltk data in: {nltk_data_dir}")

# Ensure NLTK data is available
try:
    nltk.data.find('tokenizers/punkt_tab')
    print("NLTK punkt_tab data found")
except LookupError:
    print("NLTK punkt_tab data not found, downloading...")
    nltk.download('punkt_tab', download_dir=nltk_data_dir, quiet=True)
    nltk.download('punkt', download_dir=nltk_data_dir, quiet=True)

def get_news(url):
    try:
        # Validate URL
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return {
                'status': 'error',
                'message': 'Invalid URL format'
            }

        # Set a proper user agent to avoid blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        # First check if URL is accessible
        response = requests.head(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return {
                'status': 'error',
                'message': f'URL returned status code {response.status_code}'
            }

        # Configure newspaper with custom config
        from newspaper import Config
        config = Config()
        config.headers = headers
        config.request_timeout = 10
        config.fetch_images = False

        article = Article(url, config=config)
        article.download()
        article.parse()

        # Skip NLP if NLTK data is not available
        try:
            article.nlp()
            summary = article.summary
            keywords = article.keywords
        except Exception as e:
            print(f"NLP processing failed: {e}, skipping NLP")
            summary = ""
            keywords = []

        # Validate that we got meaningful content
        if not article.text or len(article.text.strip()) < 100:
            return {
                'status': 'error',
                'message': 'Unable to extract sufficient content from the article'
            }

        return {
            'status': 'success',
            'summary': summary,
            'keywords': keywords,
            'title': article.title,
            'text': article.text,
            'url': url
        }
    except requests.exceptions.RequestException as e:
        return {
            'status': 'error',
            'message': f'Network error: {str(e)}'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Error processing article: {str(e)}'
        }
