const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Comprehensive list of skills
const knownSkills = [
  'react', 'sql', 'python', 'javascript', 'html', 'css', 'node.js', 'java', 'c++', 'c#',
  'ruby', 'php', 'typescript', 'angular', 'vue.js', 'django', 'flask', 'spring', 'mysql',
  'mongodb', 'postgresql', 'oracle', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
  'jenkins', 'ci/cd', 'linux', 'unix', 'bash', 'tensorflow', 'pytorch', 'pandas', 'numpy',
  'matplotlib', 'scikit-learn', 'machine learning', 'data science', 'big data', 'hadoop',
  'spark', 'tableau', 'power bi', 'excel', 'r', 'sass', 'less', 'bootstrap', 'graphql',
  'rest api', 'agile', 'scrum', 'devops', 'ui/ux', 'figma', 'adobe xd', 'software engineering',
  'julia', 'sas', 'apache kafka', 'scala'
];

// Learning paths for each skill with durations (in hours)
const learningPaths = {
  'react': {
    baseTitle: 'Learn React',
    resources: [
      { name: 'React Official Tutorial', url: 'https://reactjs.org/tutorial/tutorial.html', duration: 5 },
      { name: 'Udemy: React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', duration: 40 }
    ]
  },
  'sql': {
    baseTitle: 'Master SQL',
    resources: [
      { name: 'SQLZoo', url: 'https://sqlzoo.net/', duration: 10 },
      { name: 'Coursera: SQL for Data Science', url: 'https://www.coursera.org/learn/sql-for-data-science', duration: 20 }
    ]
  },
  'python': {
    baseTitle: 'Python Basics',
    resources: [
      { name: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/', duration: 15 },
      { name: 'Codecademy: Learn Python 3', url: 'https://www.codecademy.com/learn/learn-python-3', duration: 25 }
    ]
  },
  'javascript': {
    baseTitle: 'JavaScript Fundamentals',
    resources: [
      { name: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', duration: 10 },
      { name: 'freeCodeCamp: JavaScript Basics', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', duration: 20 }
    ]
  },
  'typescript': {
    baseTitle: 'Learn TypeScript',
    resources: [
      { name: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', duration: 10 },
      { name: 'Udemy: Understanding TypeScript', url: 'https://www.udemy.com/course/understanding-typescript/', duration: 15 }
    ]
  },
  'kubernetes': {
    baseTitle: 'Kubernetes Essentials',
    resources: [
      { name: 'Kubernetes.io Tutorials', url: 'https://kubernetes.io/docs/tutorials/', duration: 15 },
      { name: 'Udemy: Kubernetes Certified Administrator', url: 'https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/', duration: 30 }
    ]
  },
  'hadoop': {
    baseTitle: 'Hadoop Basics',
    resources: [
      { name: 'Apache Hadoop Tutorial', url: 'https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html', duration: 20 },
      { name: 'edX: Big Data with Hadoop', url: 'https://www.edx.org/learn/hadoop', duration: 25 }
    ]
  },
  'spark': {
    baseTitle: 'Apache Spark Introduction',
    resources: [
      { name: 'Spark Official Docs', url: 'https://spark.apache.org/docs/latest/', duration: 15 },
      { name: 'Coursera: Big Data with Spark', url: 'https://www.coursera.org/learn/big-data-spark', duration: 20 }
    ]
  },
  'tableau': {
    baseTitle: 'Tableau for Data Visualization',
    resources: [
      { name: 'Tableau Public Training', url: 'https://public.tableau.com/en-us/s/resources', duration: 10 },
      { name: 'Udemy: Tableau 2022 A-Z', url: 'https://www.udemy.com/course/tableau10/', duration: 20 }
    ]
  },
  'power bi': {
    baseTitle: 'Power BI Basics',
    resources: [
      { name: 'Microsoft Power BI Learning', url: 'https://learn.microsoft.com/en-us/power-bi/', duration: 10 },
      { name: 'Udemy: Microsoft Power BI', url: 'https://www.udemy.com/course/microsoft-power-bi-a-complete-introduction/', duration: 20 }
    ]
  },
  'julia': {
    baseTitle: 'Learn Julia',
    resources: [
      { name: 'Julia Official Docs', url: 'https://docs.julialang.org/en/v1/', duration: 15 },
      { name: 'Julia Academy', url: 'https://juliaacademy.com/', duration: 25 }
    ]
  },
  'sas': {
    baseTitle: 'SAS Programming',
    resources: [
      { name: 'SAS Official Training', url: 'https://www.sas.com/en_us/training.html', duration: 30 },
      { name: 'Udemy: SAS Programming for Beginners', url: 'https://www.udemy.com/course/sas-programming-for-beginners/', duration: 12 }
    ]
  },
  'apache kafka': {
    baseTitle: 'Apache Kafka Basics',
    resources: [
      { name: 'Kafka Documentation', url: 'https://kafka.apache.org/documentation/', duration: 15 },
      { name: 'Udemy: Apache Kafka for Beginners', url: 'https://www.udemy.com/course/apache-kafka-for-beginners/', duration: 10 }
    ]
  },
  'scala': {
    baseTitle: 'Scala Programming',
    resources: [
      { name: 'Scala Official Docs', url: 'https://docs.scala-lang.org/', duration: 15 },
      { name: 'Coursera: Functional Programming in Scala', url: 'https://www.coursera.org/learn/progfun1', duration: 20 }
    ]
  },
  'r': {
    baseTitle: 'R for Data Analysis',
    resources: [
      { name: 'R Tutorial', url: 'https://www.tutorialspoint.com/r/index.htm', duration: 10 },
      { name: 'edX: Data Science with R', url: 'https://www.edx.org/learn/r-programming', duration: 25 }
    ]
  },
  'machine learning': {
    baseTitle: 'Machine Learning Fundamentals',
    resources: [
      { name: 'Coursera: Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', duration: 55 },
      { name: 'fast.ai Practical Deep Learning', url: 'https://course.fast.ai/', duration: 35 }
    ]
  },
  'data science': {
    baseTitle: 'Data Science Essentials',
    resources: [
      { name: 'DataCamp: Introduction to Data Science', url: 'https://www.datacamp.com/courses/intro-to-data-science', duration: 15 },
      { name: 'edX: Data Science Professional Certificate', url: 'https://www.edx.org/professional-certificate/harvardx-data-science', duration: 60 }
    ]
  }
};

app.post('/api/analyze-skills', upload.single('resume'), async (req, res) => {
  try {
    const jobDesc = req.body.jobDesc.toLowerCase().trim();
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ error: 'Please upload a resume' });
    }
    if (!jobDesc) {
      return res.status(400).json({ error: 'Please enter a job description' });
    }

    const dataBuffer = fs.readFileSync(resumeFile.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text.toLowerCase().trim();

    console.log('Job Description:', jobDesc);
    console.log('Resume Text:', resumeText);

    // Normalize text into words and phrases
    const normalizeText = (text) => {
      const words = text.replace(/[^a-z0-9\s\/\.]/g, ' ').split(/\s+/).filter(Boolean);
      const phrases = [];
      for (let i = 0; i < words.length; i++) {
        phrases.push(words[i]);
        if (i < words.length - 1) phrases.push(`${words[i]} ${words[i + 1]}`);
      }
      return phrases;
    };

    const jobWords = normalizeText(jobDesc);
    const resumeWords = normalizeText(resumeText);

    // Detect skills with exact matching
    const detectSkills = (words, skillsList) => {
      const detected = new Set();
      skillsList.forEach(skill => {
        if (words.includes(skill)) {
          detected.add(skill);
        }
      });
      return Array.from(detected);
    };

    const jobSkills = detectSkills(jobWords, knownSkills);
    const resumeSkills = detectSkills(resumeWords, knownSkills);
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));

    // Extract job role (heuristic: look for common role names)
    const roles = ['data scientist', 'software engineer','devops', 'ui/ux', 'machine learning engineer'];
    const jobRole = roles.find(role => jobDesc.includes(role)) || 'General Role';

    // Generate dynamic learning paths for missing skills only
    const learningPath = missingSkills.map(skill => {
      const basePath = learningPaths[skill] || {
        baseTitle: `Learn ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
        resources: [{ name: `Search: Learn ${skill}`, url: `https://www.google.com/search?q=learn+${skill}`, duration: 10 }]
      };
      return {
        skill,
        title: `${basePath.baseTitle} for ${jobRole}`,
        resources: basePath.resources.map(resource => ({
          name: resource.name,
          url: resource.url,
          duration: resource.duration || 10 // Default duration if not specified
        }))
      };
    });

    // Detailed logging for verification
    console.log('Job Words:', jobWords);
    console.log('Resume Words:', resumeWords);
    console.log('Job Skills Detected:', jobSkills);
    console.log('Resume Skills Detected:', resumeSkills);
    console.log('Missing Skills:', missingSkills);
    console.log('Job Role Detected:', jobRole);
    console.log('Generated Learning Path:', JSON.stringify(learningPath, null, 2));

    fs.unlinkSync(resumeFile.path);

    res.json({ missingSkills, jobRole, learningPath });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});