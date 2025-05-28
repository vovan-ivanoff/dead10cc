import json

import pandas as pd
import pickle
from flask import Flask, jsonify, abort, request
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

from typing import List


def process_csv(path: str):
    wb = pd.read_csv(path)

    wb = wb.rename(columns={"breadcrumbs": "tag"})
    wb['tag'] = wb.tag.apply(lambda x: [i.lower()[1:-1]
                             for i in x[1:-1].split(',') if len(i) > 0])
    wb['tag'] = wb.tag.apply(
        lambda x: [i for i in x if i != "главная"])  # remove useless tag
    wb["brand"] = wb["brand"].fillna(value="")
    wb['description'] = wb.tag.apply(lambda x: ", ".join(x))
    wb["description"] = '[' + wb.brand + '] ' + \
        '[' + wb.brand + '] ' + wb.name + " {" + wb.description + '}'
    wb = wb.drop_duplicates(subset=['description'], keep='first')
    wb["id"] = range(len(wb))

    wb = wb[["id", "sku", "tag", "name", "rating", "review_count",
             "final_price", "description", "brand"]].set_index("id")
    return wb


wb_csv = process_csv("./wildberries_sample.csv")


def learn(wb):

    bert = SentenceTransformer('bert-base-nli-mean-tokens',
                               cache_folder='/app/model')

    # Get Embeddings for movie overviews
    sentence_embeddings = bert.encode(
        wb['description'].tolist(), show_progress_bar=True)

    # Compute similarity between products
    return cosine_similarity(sentence_embeddings)


try:
    with open("/app/model/similarity.pkl", 'rb') as f:
        similarity = pickle.load(f)
except FileNotFoundError:

    similarity = learn(wb_csv)
    with open("/app/model/similarity.pkl", 'wb') as f:
        pickle.dump(similarity, f)


def get_model_rec(sku: int, n: int = 10) -> List[int]:
    try:
        id = wb_csv[wb_csv.sku == sku].index.values[0]
    except Exception as ex:
        print(ex)
        return []
    result = similarity[id]
    recommendations = sorted(list(enumerate(result)),
                             key=lambda x: x[1], reverse=True)
    rec_ids = [i[0] for i in recommendations[:n+1]][1:]
    return [int(wb_csv.iloc[i].sku) for i in rec_ids]


app = Flask(__name__)


@app.route('/recommendation', methods=['POST'])
def get_recommendations():
    if not request.json or 'interesting_products' not in request.json:
        abort(400)
    recommended = []
    skus = request.json['interesting_products']
    skus_count = len(skus)
    recs = dict()
    for sku in skus:
        recs[sku] = get_model_rec(sku, 5)
        for (key, val) in recs.items():
            if key == sku:
                continue
            recs[sku] = [item for item in recs.get(sku) if item not in val]

    for idx in range(5):
        for sku in skus:
            if len(recs[sku]) > idx:
                recommended.append(recs[sku][idx])

    result = json.dumps({"recommended": recommended}, ensure_ascii=True, indent=4)
    return result, 201


app.run(port=5100, host='0.0.0.0')
