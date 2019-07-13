const MongoClient = require('mongodb').MongoClient;

class PositionsDalc{
    private static instance: PositionsDalc;
    private static address: string = "mongodb://0.0.0.0:27017/";
    private static db: string = "avanza";
    private static collection: string = "positions"
    private constructor(){

    }
    static getInstance(){
        if(!PositionsDalc.instance)
            PositionsDalc.instance = new PositionsDalc()
        return PositionsDalc.instance;
    }
    insert(positions: any){
        let allPostions: any[] = [];
        positions.map((position: any) => allPostions = allPostions.concat(position.positions));
        console.log("Connecting to DB..")
        MongoClient.connect(PositionsDalc.address, {useNewUrlParser: true}, function(err: any, db: any) {
            if (err) throw err;
            console.log("Connected to DB!")
            var dbo = db.db(PositionsDalc.db);
            console.log("Inserting new data...")
            dbo.collection(PositionsDalc.collection)
                .insertMany(allPostions, (err: any, res:any) => {if (err) throw err});
            console.log('Inserted new data!')
            db.close();
          });
    }
}

export { PositionsDalc }