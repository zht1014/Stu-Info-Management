const courses = Array.from({ length: 100 }, (_, index) => ({
    key: index,
    courseName: `Course ${index + 1}`,
    courseDescription: `This is the description for Course ${index + 1}.`,
    startDate: `2024-01-01`,
    endDate: `2024-06-01`,
    faculty: `Faculty ${index % 10 + 1}`,
    credits: (Math.random() * 4 + 1).toFixed(1), // 1-5学分
  }));
  
  export default courses;
  