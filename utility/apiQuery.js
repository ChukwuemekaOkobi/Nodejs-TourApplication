class APIQueryFeatures
{
    constructor(query, requestQuery)
    {
       this.query = query; 
       this.requestQuery = requestQuery; 
    }

    filter()
    {
        ///apply filtering 
        let queryObj = { ...this.requestQuery}; 
        let excludedFields = ['page','sort','limit', 'fields']; 

        excludedFields.forEach(e => delete queryObj[e]);

        //adding lte or gt in query strings to match mongodb query object
        let queryString = JSON.stringify(queryObj); 
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); 
        queryObj = JSON.parse(queryString); 

        this.query =  this.query.find(queryObj); //applyfilter

        return this;  //to enable method chaining 
    }

    sort()
    {
          //apply sorting 
          let sortby = this.requestQuery.sort;
          if(sortby)
          {  
              //query = tourquery.sort('price rate')
              sortby = sortby.split(',').join(' ');
              console.log(sortby)
              this.query = this.query.sort(sortby); 
          }
          else 
          {
              this.query = this.query.sort('-createdAt');
          }

          return this; 
    }

    limitFields()
    {
        //field limiting
        //query = Query.select('name price duration') 
        let fields = this.requestQuery.fields; 
        if(fields)
        {
             fields =  fields.split(',').join(' '); 
             this.query = this.query.select(fields);  
        }
        else
        {
             this.query = this.query.select('-__v'); //exclude with a prefixed -
        }

        return this;
    }


    paginate()
    {
        //pagination 
        const page = +this.requestQuery.page  || 1;
        const limit = +this.requestQuery.limit  || 9; 
        const skip = (page-1) * limit; 
   
        this.query = this.query.skip(skip).limit(limit); 
    
        return this;
    }


        // let tours  = await Tour.find(); // get all tours
       //method chaining query
        // let tourQuery = Tour.find()
        //                 .where('duration').equals(5)
        //                 .where('difficulty').equals('easy'); 
}



module.exports = APIQueryFeatures; 