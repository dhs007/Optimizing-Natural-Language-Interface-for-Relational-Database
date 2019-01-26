import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
# sent_tokenize is one of instances of  
# PunktSentenceTokenizer from the nltk.tokenize.punkt module 
stop_words = set(stopwords.words('english'))
p= input("Enter the sentence");
tokenized= sent_tokenize(p)
for i in tokenized:
# Word tokenizers is used to find the words  
        # and punctuation in a string 
	wordsList=nltk.word_tokenize(i)     # removing stop words from wordList 
	wordsList=[w for w in wordsList if not w in stop_words]
    #  Using a Tagger. Which is part-of-speech      # tagger or POS-tagger.  
	tagged=nltk.pos_tag(wordsList)
	print(tagged)
