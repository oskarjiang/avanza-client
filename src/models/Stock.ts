module.exports = class Stock{
    constructor(
        public name: string,
        public marketPlace: string,
    ){
        this.name = name;
        this.marketPlace = marketPlace;
    }
}