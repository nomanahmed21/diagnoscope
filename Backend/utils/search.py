import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class SearchEngine:
    def __init__(self, df):
        self.df = df
        self.embedding = np.vstack(df['embedding'].values)

    def find_top_matches(self, question_embedding, top_result=5):
            similarity = cosine_similarity(self.embedding, [question_embedding] ).flatten()
            max_indx = np.argpartition(similarity, -top_result)[-top_result:]
            return self.df.loc[max_indx].sort_index()