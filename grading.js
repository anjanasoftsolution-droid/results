/**
 * CCE Grading Utility
 */

const Grading = {
    // 9-point grading scale
    calculateGrade(percentage) {
        if (percentage >= 91) return { grade: 'A1', points: 10 };
        if (percentage >= 81) return { grade: 'A2', points: 9 };
        if (percentage >= 71) return { grade: 'B1', points: 8 };
        if (percentage >= 61) return { grade: 'B2', points: 7 };
        if (percentage >= 51) return { grade: 'C1', points: 6 };
        if (percentage >= 41) return { grade: 'C2', points: 5 };
        if (percentage >= 33) return { grade: 'D', points: 4 };
        if (percentage >= 21) return { grade: 'E1', points: 0 };
        return { grade: 'E2', points: 0 };
    }
};
