import { Calculator } from "./calculator";


describe('Test for calculator', () => {

    describe('Test for multiply', () => {
        it('#multiply should return a nine', () => {
            //AAA
            //Arrange
            //Act
            //Assert
    
    
            //Arrange
            const calculator = new Calculator();
            //Act
            const rta = calculator.multiply(3,3);
            //Assert
            expect(rta).toEqual(9);
    
        });
    
    
        it('#multiply should return a for', () => {
            //Arrange
            const calculator = new Calculator();
            //Act
            const rta = calculator.multiply(1,4);
            //Assert
            expect(rta).toEqual(4);
    
        });
    });

    describe('Test for divide', () => {
        it('#divide should return a some number', () => {
            //Arrange
            const calculator = new Calculator();
            //Act
            expect(calculator.divide(6,3)).toEqual(2);
            expect(calculator.divide(5,2)).toEqual(2.5);
    
        });
    
        it('#divide for a zero', () => {
            //Arrange
            const calculator = new Calculator();
            //Act
            expect(calculator.divide(6,0)).toBeNull();
            expect(calculator.divide(5,0)).toBeNull();
    
        });
    
        it('#test matchers', () => {
            const name = 'Leonardo';
            let name2;
    
            expect(name).toBeDefined();
            expect(name2).toBeUndefined();
    
            expect(1 + 3 === 4).toBeTruthy();
            expect(1 + 1 === 3).toBeFalsy();
    
            expect(5).toBeLessThan(10);
        });
    });

    

    
});