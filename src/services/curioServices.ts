"use client";
import DeviceController from "@espruino-tools/core";

type Vector = {
	x: number;
	y: number;
};

export class Curio extends DeviceController {
	private left: number = 0;
	private right: number = 0;
	private speed: number = 700;

	constructor() {
		super();
	}

	/**
	 * Standard move.
	 *
	 */
	public move() {
		this.UART.write(`go(${this.right}, ${this.left}, ${this.speed})\n`);
	}

	/**
	 * Stop.
	 *
	 */
	public stop() {
		this.UART.write(`go(0, 0)\n`);
	}

	/**
	 * Move with given params.
	 *
	 * @param {number} left left motor value.
	 * @param {number} right right motor value.
	 * @param {number} speed speed of the robot.
	 */
	public moveWithParams(left: number, right: number, speed: number) {
		if (speed > 700) {
			speed = 700;
		} else if (speed < 0) {
			speed = 0;
		}

		this.speed = speed * 700;

		this.left = left;
		this.right = right;

		this.UART.write(`go(${this.right}, ${this.left}, ${this.speed})\n`);
	}

	/**
	 * Move with given vector params.
	 *
	 * @param {number} x x coordinate of vector.
	 * @param {number} y y coordinate of vector.
	 * @param {number} speed 0-100 speed of the robot.
	 */
	public moveWithVectorParams(x: number, y: number, speed: number) {
		if (speed > 100) {
			speed = 100;
		} else if (speed < 0) {
			speed = 0;
		}

		this.speed = Math.round(speed * 70);

		const angle = this.calculateAngle({ x, y });
		const tempValue = (2 * angle) / 90;

		if (x >= 0) {
			if (y >= 0) {
				this.left = 1000;
				this.right = Math.round((tempValue - 1) * 1000);
			} else {
				this.left = -1000;
				this.right = Math.round((1 - tempValue) * 1000);
			}
		} else {
			if (y >= 0) {
				this.right = 1000;
				this.left = Math.round((3 - tempValue) * 1000);
			} else {
				this.right = -1000;
				this.left = Math.round((tempValue - 3) * 1000);
			}
		}

		this.UART.write(`go(${this.right}, ${this.left}, ${this.speed})\n`);
	}

	/**
	 * Returns the angle between the given vector and unit vector on X (1, 0).
	 *
	 * @param {number} x x coordinate of vector.
	 * @param {number} y y coordinate of vector.
	 */
	private calculateAngle(vector: Vector): number {
		const unit: Vector = { x: 1, y: 0 };
		const magUnit = Math.sqrt(unit.x * unit.x + unit.y * unit.y); //1

		const dotProduct = vector.x * unit.x + vector.y * unit.y;
		const magVector = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
		const cos = (dotProduct / magVector) * magUnit;
		const angle = (Math.acos(cos) * 180) / Math.PI;
		return angle;
	}

	/**
	 * Set robot parameters.
	 *
	 * @param {number} left left motor value.
	 * @param {number} right right motor value.
	 * @param {number} speed speed of the robot.
	 */
	public setParameters(left: number, right: number, speed: number) {
		if (speed > 700) {
			speed = 700;
		} else if (speed < 0) {
			speed = 0;
		}

		this.speed = speed;

		this.left = left;
		this.right = right;
	}

	/**
	 * Set robot parameters with a vector and speed.
	 *
	 * @param {number} x x coordinate of vector.
	 * @param {number} y y coordinate of vector.
	 * @param {number} speed 0-100 speed of the robot.
	 */
	public setVectorParameters(x: number, y: number, speed: number) {
		if (speed > 100) {
			speed = 100;
		} else if (speed < 0) {
			speed = 0;
		}

		this.speed = Math.round(speed * 7);

		const angle = this.calculateAngle({ x, y });
		const tempValue = (2 * angle) / 90;

		if (x >= 0) {
			if (y >= 0) {
				this.left = 1000;
				this.right = Math.round((tempValue - 1) * 1000);
			} else {
				this.left = -1000;
				this.right = Math.round((1 - tempValue) * 1000);
			}
		} else {
			if (y >= 0) {
				this.right = 1000;
				this.left = Math.round((3 - tempValue) * 1000);
			} else {
				this.right = -1000;
				this.left = Math.round((tempValue - 3) * 1000);
			}
		}
	}
}
