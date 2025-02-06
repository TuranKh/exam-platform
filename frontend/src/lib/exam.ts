export const answerOptions = ["A", "B", "C", "D", "E"];

export const selectAnswerOptions = answerOptions.map((option) => {
  return {
    value: option,
    label: option,
  };
});
