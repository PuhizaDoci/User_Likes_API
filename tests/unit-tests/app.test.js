import dotenv from 'dotenv';

dotenv.config();

test('Get port', () => {
    expect(process.env.PORT).toBe("3001");
});