const courseNames = [
  "Introduction to Computer Science",
  "Data Structures and Algorithms",
  "Web Development",
  "Machine Learning",
  "Database Management Systems",
  "Software Engineering",
  "Operating Systems",
  "Network Security",
  "Mobile App Development",
  "Cloud Computing",
];

const faculties = [
  "Dr. Smith",
  "Prof. Johnson",
  "Dr. Lee",
  "Prof. Brown",
  "Dr. Wilson",
  "Prof. Taylor",
  "Dr. Anderson",
  "Prof. Thomas",
  "Dr. Jackson",
  "Prof. White",
];

const departments = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
  "Electrical Engineering",
  "Business Administration",
  "Mechanical Engineering",
  "Mathematics",
  "Physics",
];

// // 随机生成日期范围的函数
// const getRandomDateInRange = (start, end) => {
//   const startDate = new Date(start);
//   const endDate = new Date(end);
//   const randomTime = Math.random() * (endDate - startDate) + startDate.getTime();
//   return new Date(randomTime).toISOString().split("T")[0];
// };

// 获取随机的课程开始日期
const getRandomStartDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + Math.floor(Math.random() * 30)); // 未来0-30天
  return today.toISOString().split("T")[0];
};

// 课程结束日期将会在开始日期之后1到3个月内
const getRandomEndDate = (startDate) => {
  const start = new Date(startDate);
  const endDate = new Date(start);
  endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 3) + 1); // 1-3个月后
  return endDate.toISOString().split("T")[0]; 
};

// 课程选择状态初始化为未选
const courses = Array.from({ length: 100 }, (_, index) => {
  const startDate = getRandomStartDate();
  return {
    key: index,
    courseName: courseNames[index % courseNames.length],
    courseDescription: `This is the description for ${courseNames[index % courseNames.length]}.`,
    startDate: startDate,
    endDate: getRandomEndDate(startDate),
    faculty: faculties[index % faculties.length],
    credits: (Math.floor(Math.random() * 4) + 1).toFixed(1), // 1-5学分
    department: departments[index % departments.length], // 新增的部门字段
    selected: false, // 默认全部未选
  };
});

// 打乱课程数组
const shuffledCourses = courses.sort(() => Math.random() - 0.5);

export default shuffledCourses;
