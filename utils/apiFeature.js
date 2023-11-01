class Apifeature {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword, // regex means regular expression
            $options: "i", // means case insenstive
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const quarycopy = { ...this.querystr }; // for copy the original query in url
    //removing some field for category
    const removefield = ["keyword", "page", "limit"];
    removefield.forEach((key) => delete quarycopy[key]); // for removing keyword for search and page value

    //filter for price and rating
    let quertStr = JSON.stringify(quarycopy); // convert json to string because for catagory
    // filter work good but price we want json key as $gt, $lt for mongodb search so first
    // convert to sting then add $ where gt,gte,lt,lte and catagory remain same again convert 
    //to json formet using Json parse method
    quertStr = quertStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(quertStr));
    // this.query = this.query.find(quarycopy);
    // console.log(quarycopy);
    return this;
  }
  pagination(resultperpage) {
    const currpage = Number(this.querystr.page) || 1;
    const skip = resultperpage * (currpage - 1);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }
}
module.exports = Apifeature;
