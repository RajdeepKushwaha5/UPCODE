// Programming Language Curriculum Data
export const programmingCurriculum = {
  python: {
    name: "Python",
    color: "from-blue-400 to-green-400",
    icon: "🐍",
    description: "Learn Python, the most beginner-friendly programming language",
    totalLessons: 5,
    lessons: [
      {
        title: "Introduction to Python",
        content: `Welcome to Python! 🐍 Python is a beginner-friendly, powerful programming language created by Guido van Rossum.

**Why Python?**
- Simple, readable syntax
- Versatile (web, AI, data science, automation)
- Huge community and libraries
- Great for beginners

**Your first Python program:**
\`\`\`python
print("Hello, World!")
print("Welcome to Python programming!")
\`\`\`

**Fun fact:** Python is named after the British comedy group "Monty Python"! 🎭`,
        codeExample: 'print("Hello, World!")',
        questions: [
          {
            question: "What function do we use to display text in Python?",
            options: ["print()", "display()", "show()", "output()"],
            correct: 0,
            explanation: "Correct! print() is the fundamental function for displaying text in Python. It's simple and powerful!"
          },
          {
            question: "Which of these is a correct way to print 'Hello Python' in Python?",
            options: ["print('Hello Python')", "print['Hello Python']", "display('Hello Python')", "echo('Hello Python')"],
            correct: 0,
            explanation: "Perfect! We use print() with parentheses and quotes around the text. Python uses parentheses for function calls."
          },
          {
            question: "Python was named after which comedy group?",
            options: ["The Beatles", "Monty Python", "Saturday Night Live", "The Simpsons"],
            correct: 1,
            explanation: "Exactly! Python was named after Monty Python's Flying Circus, showing that programming can have humor too! 😄"
          }
        ]
      },
      {
        title: "Variables and Data Types",
        content: `Variables are like containers that store data. In Python, creating variables is super easy! 📦

**Creating Variables:**
\`\`\`python
name = "Alice"        # String (text)
age = 25             # Integer (whole number)
height = 5.6         # Float (decimal number)
is_student = True    # Boolean (True/False)
\`\`\`

**Python's Main Data Types:**
- **String**: Text data like "Hello"
- **Integer**: Whole numbers like 42
- **Float**: Decimal numbers like 3.14
- **Boolean**: True or False values

**Variable Naming Rules:**
- Start with letter or underscore
- Can contain letters, numbers, underscores
- Case sensitive (age ≠ Age)
- Use descriptive names!`,
        codeExample: `name = "Python Learner"
age = 20
print(f"Hello {name}, you are {age} years old!")`,
        questions: [
          {
            question: "What data type is the value 'Python Programming'?",
            options: ["Integer", "String", "Float", "Boolean"],
            correct: 1,
            explanation: "Correct! Text enclosed in quotes (single or double) is a String data type in Python."
          },
          {
            question: "Which variable assignment is correct in Python?",
            options: ["25 = age", "age = 25", "age == 25", "set age = 25"],
            correct: 1,
            explanation: "Right! We assign values to variables using the = operator. The variable name goes on the left, value on the right."
          },
          {
            question: "What data type is the value True?",
            options: ["String", "Integer", "Boolean", "Float"],
            correct: 2,
            explanation: "Excellent! True (and False) are Boolean values in Python, representing logical true/false states."
          }
        ]
      },
      {
        title: "Input and Output",
        content: `Let's make our programs interactive! We'll learn how to get input from users and display output. 💬

**Getting User Input:**
\`\`\`python
name = input("What's your name? ")
age = input("How old are you? ")
print(f"Hello {name}! You are {age} years old.")
\`\`\`

**Important Note:** input() always returns a string! To get numbers:
\`\`\`python
age = int(input("Enter your age: "))  # Convert to integer
height = float(input("Enter height: "))  # Convert to float
\`\`\`

**F-strings (Formatted Strings):**
\`\`\`python
name = "Python"
version = 3.9
print(f"I'm learning {name} version {version}!")
\`\`\`

F-strings are the modern, clean way to format text in Python! 🎨`,
        codeExample: `name = input("Enter your name: ")
favorite_color = input("What's your favorite color? ")
print(f"Nice to meet you {name}! {favorite_color} is a great color!")`,
        questions: [
          {
            question: "What function is used to get user input in Python?",
            options: ["get()", "input()", "read()", "scan()"],
            correct: 1,
            explanation: "Perfect! input() is the function that reads user input from the keyboard and returns it as a string."
          },
          {
            question: "What data type does input() always return?",
            options: ["Integer", "Float", "String", "Boolean"],
            correct: 2,
            explanation: "Correct! input() always returns a string, even if the user types numbers. We need to convert if we want numbers."
          },
          {
            question: "Which is the modern way to format strings in Python?",
            options: ["% formatting", "f-strings", ".format()", "+ concatenation"],
            correct: 1,
            explanation: "Great! F-strings (f'Hello {name}') are the modern, readable way to format strings in Python 3.6+."
          }
        ]
      }
    ]
  },

  javascript: {
    name: "JavaScript",
    color: "from-yellow-400 to-orange-400",
    icon: "🚀",
    description: "Master JavaScript, the language of the web",
    totalLessons: 4,
    lessons: [
      {
        title: "Introduction to JavaScript",
        content: `Welcome to JavaScript! 🚀 The language that makes the web interactive and dynamic!

**What is JavaScript?**
- The programming language of the web
- Runs in browsers and servers (Node.js)
- Makes websites interactive
- Used by 98% of websites!

**Your first JavaScript:**
\`\`\`javascript
console.log("Hello, JavaScript World!");
alert("Welcome to JavaScript!");
\`\`\`

**JavaScript Powers:**
- Interactive websites 🌐
- Mobile apps 📱
- Desktop applications 💻
- Games 🎮
- AI and Machine Learning 🤖

**Where JavaScript runs:**
- Browsers (Chrome, Firefox, Safari)
- Servers (Node.js)
- Mobile apps (React Native)`,
        codeExample: 'console.log("Hello from JavaScript!");',
        questions: [
          {
            question: "What function displays messages in the browser console?",
            options: ["print()", "console.log()", "alert()", "display()"],
            correct: 1,
            explanation: "Correct! console.log() outputs messages to the browser's developer console. It's perfect for debugging!"
          },
          {
            question: "What percentage of websites use JavaScript?",
            options: ["50%", "75%", "98%", "100%"],
            correct: 2,
            explanation: "Amazing! About 98% of websites use JavaScript, making it the most widely used programming language on the web!"
          }
        ]
      },
      {
        title: "Variables and Data Types",
        content: `JavaScript has flexible variables and multiple data types! Let's explore them. 📦

**Declaring Variables:**
\`\`\`javascript
let name = "JavaScript";     // Can be changed
const age = 28;             // Cannot be changed  
var city = "Web City";      // Old way (avoid)
\`\`\`

**Data Types:**
\`\`\`javascript
let text = "Hello World";       // String
let number = 42;               // Number
let decimal = 3.14;            // Number (same type)
let isAwesome = true;          // Boolean
let nothing = null;            // Null
let notDefined;               // Undefined
\`\`\`

**Modern Best Practices:**
- Use \`let\` for variables that change
- Use \`const\` for variables that don't change
- Avoid \`var\` (it's old and confusing)
- Use descriptive variable names`,
        codeExample: `const greeting = "Hello";
let userName = "JavaScript Learner";
console.log(greeting + " " + userName + "!");`,
        questions: [
          {
            question: "Which keyword creates a variable that cannot be changed?",
            options: ["let", "var", "const", "final"],
            correct: 2,
            explanation: "Excellent! const creates constants that cannot be reassigned after declaration. Perfect for values that shouldn't change!"
          },
          {
            question: "What's the modern way to declare a changeable variable?",
            options: ["var", "let", "const", "variable"],
            correct: 1,
            explanation: "Perfect! let is the modern way to declare variables that can be changed. It has better scope rules than var."
          }
        ]
      }
    ]
  },

  java: {
    name: "Java",
    color: "from-red-400 to-orange-500",
    icon: "☕",
    description: "Learn Java, the enterprise programming language",
    totalLessons: 4,
    lessons: [
      {
        title: "Introduction to Java",
        content: `Welcome to Java! ☕ The robust, object-oriented programming language that powers enterprise applications worldwide!

**Java's Motto:** "Write Once, Run Anywhere" 🌍

**What makes Java special?**
- Platform independent (runs on any OS)
- Object-oriented programming
- Strong memory management
- Secure and robust
- Huge ecosystem and community

**Your first Java program:**
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java World!");
    }
}
\`\`\`

**Java is used for:**
- Enterprise applications 🏢
- Android mobile apps 📱
- Web applications 🌐
- Scientific applications 🔬
- Big data processing 📊`,
        codeExample: 'System.out.println("Welcome to Java programming!");',
        questions: [
          {
            question: "What method is the entry point of a Java program?",
            options: ["start()", "main()", "begin()", "init()"],
            correct: 1,
            explanation: "Perfect! main() method is where Java programs start execution. It's the entry point that the JVM looks for."
          },
          {
            question: "What is Java's famous motto?",
            options: ["Code Once, Use Everywhere", "Write Once, Run Anywhere", "Build Once, Deploy Everywhere", "Create Once, Execute Anywhere"],
            correct: 1,
            explanation: "Exactly! 'Write Once, Run Anywhere' (WORA) means Java code can run on any platform with a Java Virtual Machine."
          }
        ]
      }
    ]
  },

  cpp: {
    name: "C++",
    color: "from-blue-600 to-purple-600",
    icon: "⚡",
    description: "Master C++, the powerful systems programming language",
    totalLessons: 4,
    lessons: [
      {
        title: "Introduction to C++",
        content: `Welcome to C++! ⚡ A powerful, high-performance programming language that gives you complete control!

**C++ Powers:**
- Operating systems (Windows, Linux)
- Game engines (Unreal Engine, Unity core)
- Browsers (Chrome, Firefox)
- Embedded systems
- High-frequency trading systems

**Your first C++ program:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++ World!" << endl;
    return 0;
}
\`\`\`

**Key Features:**
- Object-oriented + procedural programming
- Manual memory management
- High performance and efficiency
- Compiled language (fast execution)
- Rich standard library (STL)`,
        codeExample: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to C++!" << endl;\n    return 0;\n}',
        questions: [
          {
            question: "What header file is needed for input/output in C++?",
            options: ["<stdio.h>", "<iostream>", "<input>", "<output>"],
            correct: 1,
            explanation: "Correct! <iostream> provides input/output stream functionality in C++, including cout and cin."
          },
          {
            question: "What does 'cout' stand for in C++?",
            options: ["Console Output", "Character Output", "C++ Output", "Computer Output"],
            correct: 0,
            explanation: "Perfect! 'cout' stands for 'Console Output' and is used to display text to the console in C++."
          }
        ]
      }
    ]
  },

  // Add more languages as needed...
  c: {
    name: "C",
    color: "from-gray-400 to-blue-500",
    icon: "🔧",
    description: "Learn C, the foundation of modern programming",
    totalLessons: 3,
    lessons: [
      {
        title: "Introduction to C",
        content: `Welcome to C! 🔧 The mother of all modern programming languages!

**Why learn C?**
- Foundation of modern programming
- Understanding of how computers work
- Direct memory manipulation
- Basis for C++, Java, JavaScript syntax
- Still widely used in systems programming

**Your first C program:**
\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, C World!\\n");
    return 0;
}
\`\`\`

**C is used in:**
- Operating systems (Linux, Windows kernel)
- Embedded systems
- Device drivers
- System programming
- Performance-critical applications`,
        codeExample: '#include <stdio.h>\n\nint main() {\n    printf("Welcome to C programming!\\n");\n    return 0;\n}',
        questions: [
          {
            question: "What function is used to print text in C?",
            options: ["print()", "printf()", "cout", "puts()"],
            correct: 1,
            explanation: "Correct! printf() is the standard function for formatted output in C programming."
          }
        ]
      }
    ]
  }
};

export default programmingCurriculum;
