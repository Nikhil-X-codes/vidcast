## 📊 Aggregation Pipeline in MongoDB

**Aggregation Pipeline** is a framework in MongoDB used to **process and transform documents** in a collection.

It consists of **different stages**, where the output of one stage becomes the input to the next — forming a data processing pipeline.it can be visualize as onion layer

---

### 🔍 Why Aggregation Pipeline is Used?

1. **Grouping Data** — e.g., count total users in each city
2. **Filtering** based on complex conditions
3. **Joining Collections** using the `$lookup` operation
4. **Projecting Specific Fields** — selecting or reshaping document fields

---

### ⚙️ How is it Used?

Basic syntax:

```js
db.collection.aggregate([
  { stage1 },
  { stage2 },
  ...
])


