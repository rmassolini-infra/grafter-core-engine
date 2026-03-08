import { describe, it, expect } from "vitest";
import {
  calculateGrafterMetrics,
  calculateFatigueLife,
  generateDegradationCurve,
  formatCycles,
} from "@/lib/grafter-engine";

describe("Grafter Engine", () => {
  describe("calculateGrafterMetrics", () => {
    it("returns positive stiffness and strength for valid inputs", () => {
      const result = calculateGrafterMetrics(0.3, 50);
      expect(result.stiffness).toBeGreaterThan(0);
      expect(result.strength).toBeGreaterThan(0);
    });

    it("returns matrix-only values at vf=0", () => {
      const result = calculateGrafterMetrics(0, 50);
      expect(result.stiffness).toBeCloseTo(1300, 0);
      expect(result.strength).toBeCloseTo(30, 0);
    });

    it("accepts custom material properties", () => {
      const a = calculateGrafterMetrics(0.3, 50);
      const b = calculateGrafterMetrics(0.3, 50, 50000, 800, 2000, 50);
      expect(b.stiffness).not.toEqual(a.stiffness);
      expect(b.strength).not.toEqual(a.strength);
    });
  });

  describe("calculateFatigueLife", () => {
    it("returns cycles > 0 when stress < strength", () => {
      const result = calculateFatigueLife(25, 54);
      expect(result.cycles).toBeGreaterThan(0);
      expect(result.stressRatio).toBeLessThan(1);
    });

    it("returns 0 cycles when stress >= strength", () => {
      const result = calculateFatigueLife(60, 54);
      expect(result.cycles).toBe(0);
    });

    it("uses custom A and B constants", () => {
      const a = calculateFatigueLife(25, 54, 12, 10);
      const b = calculateFatigueLife(25, 54, 15, 8);
      expect(b.cycles).not.toEqual(a.cycles);
    });
  });

  describe("generateDegradationCurve", () => {
    it("starts at full stiffness and degrades", () => {
      const data = generateDegradationCurve(3000, 100000);
      expect(data[0].stiffnessRatio).toBe(1);
      expect(data[data.length - 1].stiffnessRatio).toBeLessThan(1);
    });

    it("handles Nf=0 gracefully", () => {
      const data = generateDegradationCurve(3000, 0);
      expect(data).toHaveLength(1);
      expect(data[0].stiffnessRatio).toBe(1);
    });
  });

  describe("formatCycles", () => {
    it("formats large numbers correctly", () => {
      expect(formatCycles(1500)).toBe("1.5K");
      expect(formatCycles(2500000)).toBe("2.5M");
      expect(formatCycles(3000000000)).toBe("3.0B");
      expect(formatCycles(500)).toBe("500");
    });
  });
});
