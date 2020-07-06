import { InvalidArgumentException } from './invalid-argument-exception';

describe('InvalidArgumentException', () => {
  it('should create an instance', () => {
    expect(new InvalidArgumentException()).toBeTruthy();
  });
});
