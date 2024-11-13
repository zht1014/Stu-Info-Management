import Mock from 'mockjs';

export const examData = Mock.mock("/exam/list", "get", {
    code: 200,
    message: 'ok',
    'list|10': [
        {
            'course_name|+1': ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Music', 'Art'],
            'course_id|1': /\d{4}/, // 使用正则表达式生成4位随机数字
            'exam_date|1': [
                '',
                '2024-01-22',
                '2024-02-05',
                '',
                '2024-03-01',
                '2024-03-15',
                '',
                '2024-04-15',
                '2024-05-01',
                '2024-05-15'
            ],
            'location|1': ['Classroom', 'Lab', 'Online', ''],
            'type|1': ['medium', 'final', 'others'],
            'status|1': ['SCHEDULED', 'COMPLITED', 'CANCELED', 'UNSCHEDULED'],
            'duration_minutes|1': [90, 120, 180, 0]
        }
    ]
});
