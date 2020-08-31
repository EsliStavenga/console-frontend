import {InvalidArgumentException} from './invalid-argument-exception';

describe('InvalidArgumentException', () => {
	it('should create an instance', () => {
		expect(new InvalidArgumentException()).toBeTruthy();
	});

	it('should throw an error with a message', () => {
		const message = 'the message';

		expect(() => {
			throw new InvalidArgumentException(message)
		}).toThrow(new InvalidArgumentException(message));
	})
});
