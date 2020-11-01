function LandingCols() {
    
    let colRows = [];
    
    for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 9; j++) {
            colRows.push({col: j, row: i});
        }
    }
    
    return colRows;
}
export default LandingCols;