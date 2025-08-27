// Comprehensive learning resources for each programming language
// Updated with latest resources as of 2025

export const languageResources = {
  python: {
    introduction: {
      overview: "Python is a high-level, interpreted programming language known for its simple syntax and readability. Created by Guido van Rossum in 1991, Python emphasizes code readability and allows programmers to express concepts in fewer lines of code.",
      useCases: [
        "Data Science & Machine Learning",
        "Web Development (Django, Flask)",
        "Automation & Scripting",
        "Desktop Applications",
        "Scientific Computing",
        "AI & Deep Learning"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Installation & Setup",
        steps: [
          "Download Python from python.org (latest version 3.12+)",
          "Install a code editor (VS Code, PyCharm, or Sublime Text)",
          "Open terminal/command prompt and verify installation: python --version",
          "Install pip (package manager): python -m ensurepip --upgrade"
        ]
      },
      firstCode: {
        title: "Your First Python Program",
        code: `# Hello World in Python
print("Hello, World!")

# Variables and basic operations
name = "Python"
version = 3.12
is_awesome = True

print(f"Welcome to {name} {version}!")
print(f"Is Python awesome? {is_awesome}")

# Basic input
user_name = input("What's your name? ")
print(f"Nice to meet you, {user_name}!")`
      }
    },
    coreConcepts: [
      {
        topic: "Variables & Data Types",
        description: "Understanding strings, integers, floats, booleans, lists, dictionaries, and tuples"
      },
      {
        topic: "Control Structures",
        description: "If statements, for loops, while loops, and conditional logic"
      },
      {
        topic: "Functions & Modules",
        description: "Creating reusable code blocks and importing external libraries"
      },
      {
        topic: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, and encapsulation"
      },
      {
        topic: "File Handling & I/O",
        description: "Reading from and writing to files, error handling"
      },
      {
        topic: "Libraries & Frameworks",
        description: "NumPy, Pandas, Django, Flask, Requests, and more"
      }
    ],
    interactiveTutorials: [
      {
        name: "Python.org Interactive Tutorial",
        url: "https://docs.python.org/3/tutorial/",
        description: "Official Python tutorial with interactive examples",
        free: true
      },
      {
        name: "Codecademy Python Course",
        url: "https://www.codecademy.com/learn/learn-python-3",
        description: "Hands-on Python coding exercises and projects",
        free: false
      },
      {
        name: "Python Tutor (Visualizer)",
        url: "https://pythontutor.com/",
        description: "Visualize code execution step by step",
        free: true
      },
      {
        name: "HackerRank Python Domain",
        url: "https://www.hackerrank.com/domains/python",
        description: "Coding challenges to practice Python skills",
        free: true
      }
    ],
    videoResources: [
      {
        name: "Python for Everybody (University of Michigan)",
        url: "https://www.coursera.org/specializations/python",
        description: "Complete Python course from basics to applications",
        platform: "Coursera",
        free: true
      },
      {
        name: "Corey Schafer's Python Tutorials",
        url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
        description: "Comprehensive Python tutorial series on YouTube",
        platform: "YouTube",
        free: true
      },
      {
        name: "Automate the Boring Stuff",
        url: "https://automatetheboringstuff.com/",
        description: "Practical Python programming for total beginners",
        platform: "Online Book/Videos",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "Python 3 Cheat Sheet",
        url: "https://perso.limsi.fr/pointal/_media/python:cours:mementopython3-english.pdf",
        description: "Comprehensive Python syntax reference"
      },
      {
        name: "Python Data Structures Cheat Sheet",
        url: "https://www.pythoncheatsheet.org/",
        description: "Quick reference for lists, dictionaries, sets, and tuples"
      }
    ],
    community: [
      {
        name: "r/Python",
        url: "https://www.reddit.com/r/Python/",
        description: "Active Python community on Reddit"
      },
      {
        name: "Python.org Community",
        url: "https://www.python.org/community/",
        description: "Official Python community resources"
      },
      {
        name: "Stack Overflow Python Tag",
        url: "https://stackoverflow.com/questions/tagged/python",
        description: "Get help with Python programming questions"
      }
    ]
  },

  javascript: {
    introduction: {
      overview: "JavaScript is a versatile, high-level programming language primarily used for web development. It enables interactive web pages and runs on both client-side (browsers) and server-side (Node.js) environments.",
      useCases: [
        "Frontend Web Development",
        "Backend Development (Node.js)",
        "Mobile App Development (React Native)",
        "Desktop Applications (Electron)",
        "Progressive Web Apps",
        "Browser Extensions"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Getting Started",
        steps: [
          "Open your web browser (Chrome, Firefox, Safari, or Edge)",
          "Press F12 to open Developer Tools",
          "Navigate to the Console tab",
          "You can now write JavaScript directly!",
          "For development: Install Node.js from nodejs.org",
          "Install VS Code with JavaScript extensions"
        ]
      },
      firstCode: {
        title: "Your First JavaScript Code",
        code: `// Hello World in JavaScript
console.log("Hello, World!");

// Variables (ES6+ syntax)
const name = "JavaScript";
let year = 2025;
var isAwesome = true;

// Template literals
console.log(\`Welcome to \${name} in \${year}!\`);

// Functions
function greetUser(userName) {
    return \`Hello, \${userName}! Welcome to JavaScript!\`;
}

// Arrow function (ES6)
const add = (a, b) => a + b;

console.log(greetUser("Developer"));
console.log(add(5, 3));`
      }
    },
    coreConcepts: [
      {
        topic: "Variables & Data Types",
        description: "let, const, var, strings, numbers, booleans, arrays, objects"
      },
      {
        topic: "Functions & Scope",
        description: "Function declarations, expressions, arrow functions, closures"
      },
      {
        topic: "DOM Manipulation",
        description: "Selecting elements, event handling, dynamic content updates"
      },
      {
        topic: "Asynchronous Programming",
        description: "Promises, async/await, callbacks, fetch API"
      },
      {
        topic: "ES6+ Features",
        description: "Destructuring, spread operator, modules, classes"
      },
      {
        topic: "Error Handling",
        description: "try/catch blocks, error objects, debugging techniques"
      }
    ],
    interactiveTutorials: [
      {
        name: "freeCodeCamp JavaScript Algorithms",
        url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        description: "Interactive JavaScript course with projects",
        free: true
      },
      {
        name: "JavaScript.info Interactive Tutorial",
        url: "https://javascript.info/",
        description: "Modern JavaScript tutorial with examples",
        free: true
      },
      {
        name: "CodePen JavaScript",
        url: "https://codepen.io/",
        description: "Online code editor to practice JavaScript",
        free: true
      }
    ],
    videoResources: [
      {
        name: "JavaScript Crash Course",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        description: "Complete JavaScript course for beginners",
        platform: "YouTube",
        free: true
      },
      {
        name: "The Complete JavaScript Course 2025",
        url: "https://www.udemy.com/course/the-complete-javascript-course/",
        description: "Comprehensive JavaScript course from basics to advanced",
        platform: "Udemy",
        free: false
      }
    ],
    cheatSheets: [
      {
        name: "JavaScript Cheat Sheet",
        url: "https://htmlcheatsheet.com/js/",
        description: "Quick reference for JavaScript syntax and methods"
      },
      {
        name: "ES6 Features Cheat Sheet",
        url: "https://devhints.io/es6",
        description: "Modern JavaScript features reference"
      }
    ],
    community: [
      {
        name: "r/JavaScript",
        url: "https://www.reddit.com/r/javascript/",
        description: "JavaScript community discussions and resources"
      },
      {
        name: "Stack Overflow JavaScript",
        url: "https://stackoverflow.com/questions/tagged/javascript",
        description: "JavaScript questions and answers"
      }
    ]
  },

  cpp: {
    introduction: {
      overview: "C++ is a powerful, general-purpose programming language developed by Bjarne Stroustrup. It supports both procedural and object-oriented programming paradigms and is widely used for system programming, game development, and performance-critical applications.",
      useCases: [
        "System Programming",
        "Game Development",
        "Embedded Systems",
        "Desktop Applications",
        "Real-time Systems",
        "High-Performance Computing"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Development Environment Setup",
        steps: [
          "Install a C++ compiler (GCC, Clang, or MSVC)",
          "Set up an IDE (Code::Blocks, Dev-C++, CLion, or VS Code)",
          "For Windows: Install MinGW or Visual Studio",
          "For Linux: Install build-essential package",
          "For Mac: Install Xcode Command Line Tools"
        ]
      },
      firstCode: {
        title: "Your First C++ Program",
        code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    // Hello World
    cout << "Hello, World!" << endl;
    
    // Variables
    string name = "C++";
    int version = 23; // C++23 is the latest standard
    bool isAwesome = true;
    
    // Output with variables
    cout << "Welcome to " << name << " " << version << "!" << endl;
    cout << "Is C++ awesome? " << (isAwesome ? "Yes!" : "No!") << endl;
    
    // User input
    string userName;
    cout << "What's your name? ";
    getline(cin, userName);
    cout << "Nice to meet you, " << userName << "!" << endl;
    
    return 0;
}`
      }
    },
    coreConcepts: [
      {
        topic: "Variables & Data Types",
        description: "int, float, double, char, bool, arrays, pointers, references"
      },
      {
        topic: "Control Structures",
        description: "if/else, switch, for, while, do-while loops"
      },
      {
        topic: "Functions & Overloading",
        description: "Function definition, parameters, return types, function overloading"
      },
      {
        topic: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, polymorphism, encapsulation"
      },
      {
        topic: "Memory Management",
        description: "Dynamic allocation, pointers, smart pointers, RAII"
      },
      {
        topic: "STL (Standard Template Library)",
        description: "Containers, algorithms, iterators, vectors, maps"
      }
    ],
    interactiveTutorials: [
      {
        name: "Programiz C++ Tutorial",
        url: "https://www.programiz.com/cpp-programming",
        description: "Interactive C++ tutorial with examples",
        free: true
      },
      {
        name: "HackerRank C++ Domain",
        url: "https://www.hackerrank.com/domains/cpp",
        description: "C++ coding challenges and practice problems",
        free: true
      }
    ],
    videoResources: [
      {
        name: "C++ Programming Course",
        url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        description: "Complete C++ course from basics to advanced",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "C++ Reference",
        url: "https://en.cppreference.com/w/",
        description: "Comprehensive C++ language reference"
      }
    ],
    community: [
      {
        name: "r/cpp",
        url: "https://www.reddit.com/r/cpp/",
        description: "C++ community discussions and news"
      },
      {
        name: "Stack Overflow C++",
        url: "https://stackoverflow.com/questions/tagged/c%2b%2b",
        description: "C++ programming questions and solutions"
      }
    ]
  },

  java: {
    introduction: {
      overview: "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It's a general-purpose language intended to let developers write once, run anywhere (WORA).",
      useCases: [
        "Enterprise Applications",
        "Android Development",
        "Web Applications",
        "Desktop Applications",
        "Scientific Applications",
        "Big Data Processing"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Java Development Kit Setup",
        steps: [
          "Download JDK 21 (LTS) from Oracle or OpenJDK",
          "Install and set JAVA_HOME environment variable",
          "Install an IDE (IntelliJ IDEA, Eclipse, or NetBeans)",
          "Verify installation: java --version and javac --version"
        ]
      },
      firstCode: {
        title: "Your First Java Program",
        code: `public class HelloWorld {
    public static void main(String[] args) {
        // Hello World
        System.out.println("Hello, World!");
        
        // Variables
        String name = "Java";
        int version = 21;
        boolean isAwesome = true;
        
        // Output with variables
        System.out.printf("Welcome to %s %d!%n", name, version);
        System.out.println("Is Java awesome? " + isAwesome);
        
        // Basic method call
        greetUser("Developer");
    }
    
    public static void greetUser(String userName) {
        System.out.println("Hello, " + userName + "! Welcome to Java!");
    }
}`
      }
    },
    coreConcepts: [
      {
        topic: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, polymorphism, encapsulation, abstraction"
      },
      {
        topic: "Data Types & Variables",
        description: "Primitives, objects, arrays, collections, generics"
      },
      {
        topic: "Exception Handling",
        description: "try-catch-finally, checked vs unchecked exceptions"
      },
      {
        topic: "Collections Framework",
        description: "List, Set, Map interfaces and their implementations"
      },
      {
        topic: "Multithreading",
        description: "Thread creation, synchronization, concurrent programming"
      },
      {
        topic: "I/O Operations",
        description: "File handling, streams, serialization"
      }
    ],
    interactiveTutorials: [
      {
        name: "Oracle Java Tutorial",
        url: "https://docs.oracle.com/javase/tutorial/",
        description: "Official Java tutorial from Oracle",
        free: true
      },
      {
        name: "Codecademy Java Course",
        url: "https://www.codecademy.com/learn/learn-java",
        description: "Interactive Java programming course",
        free: false
      }
    ],
    videoResources: [
      {
        name: "Java Programming Masterclass",
        url: "https://www.udemy.com/course/java-the-complete-java-developer-course/",
        description: "Comprehensive Java course covering all aspects",
        platform: "Udemy",
        free: false
      }
    ],
    cheatSheets: [
      {
        name: "Java 8 Cheat Sheet",
        url: "https://www.baeldung.com/java-8-cheat-sheet",
        description: "Quick reference for Java 8 features"
      }
    ],
    community: [
      {
        name: "r/learnjava",
        url: "https://www.reddit.com/r/learnjava/",
        description: "Community for Java learners"
      }
    ]
  },

  c: {
    introduction: {
      overview: "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion. It's one of the most widely used programming languages and forms the foundation for many other languages.",
      useCases: [
        "System Programming",
        "Operating Systems",
        "Embedded Systems",
        "Device Drivers",
        "Compiler Design",
        "Database Systems"
      ]
    },
    gettingStarted: {
      setup: {
        title: "C Compiler Setup",
        steps: [
          "Install GCC compiler (Linux/Mac) or MinGW (Windows)",
          "Set up a text editor or IDE (VS Code, Code::Blocks, Dev-C++)",
          "Verify installation: gcc --version",
          "Create your first .c file"
        ]
      },
      firstCode: {
        title: "Your First C Program",
        code: `#include <stdio.h>
#include <string.h>

int main() {
    // Hello World
    printf("Hello, World!\\n");
    
    // Variables
    char name[] = "C Programming";
    int year = 1972;
    int is_awesome = 1; // C uses 1 for true, 0 for false
    
    // Output with variables
    printf("Welcome to %s!\\n", name);
    printf("C was created in %d\\n", year);
    printf("Is C awesome? %s\\n", is_awesome ? "Yes!" : "No!");
    
    // User input
    char user_name[50];
    printf("What's your name? ");
    fgets(user_name, sizeof(user_name), stdin);
    
    // Remove newline character
    user_name[strcspn(user_name, "\\n")] = 0;
    
    printf("Nice to meet you, %s!\\n", user_name);
    
    return 0;
}`
      }
    },
    coreConcepts: [
      {
        topic: "Variables & Data Types",
        description: "int, char, float, double, arrays, pointers"
      },
      {
        topic: "Control Structures",
        description: "if/else, switch, loops (for, while, do-while)"
      },
      {
        topic: "Functions",
        description: "Function definition, parameters, return values, recursion"
      },
      {
        topic: "Pointers & Memory",
        description: "Pointer arithmetic, dynamic memory allocation, memory management"
      },
      {
        topic: "Structures & Unions",
        description: "User-defined data types, struct, union, typedef"
      },
      {
        topic: "File I/O",
        description: "File operations, reading/writing files, file pointers"
      }
    ],
    interactiveTutorials: [
      {
        name: "Learn-C.org",
        url: "https://www.learn-c.org/",
        description: "Interactive C programming tutorial",
        free: true
      }
    ],
    videoResources: [
      {
        name: "C Programming Tutorial for Beginners",
        url: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
        description: "Complete C programming course",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "C Reference Card",
        url: "https://users.ece.utexas.edu/~adnan/c-refcard.pdf",
        description: "C language reference card"
      }
    ],
    community: [
      {
        name: "r/C_Programming",
        url: "https://www.reddit.com/r/C_Programming/",
        description: "C programming community"
      }
    ]
  },

  rust: {
    introduction: {
      overview: "Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety. It achieves memory safety without garbage collection, making it ideal for performance-critical applications.",
      useCases: [
        "Systems Programming",
        "Web Assembly",
        "Blockchain Development",
        "Game Engines",
        "Operating Systems",
        "Network Services"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Rust Installation",
        steps: [
          "Install Rust via rustup: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
          "Restart your terminal or run: source ~/.cargo/env",
          "Verify installation: rustc --version",
          "Install VS Code with rust-analyzer extension"
        ]
      },
      firstCode: {
        title: "Your First Rust Program",
        code: `fn main() {
    // Hello World
    println!("Hello, World!");
    
    // Variables (immutable by default)
    let name = "Rust";
    let mut year = 2015; // mut makes it mutable
    let is_awesome = true;
    
    // Output with variables
    println!("Welcome to {}!", name);
    println!("Rust was first released in {}", year);
    println!("Is Rust awesome? {}", is_awesome);
    
    // Modify mutable variable
    year = 2025;
    println!("Current year: {}", year);
    
    // Function call
    greet_user("Developer");
}

fn greet_user(user_name: &str) {
    println!("Hello, {}! Welcome to Rust!", user_name);
}`
      }
    },
    coreConcepts: [
      {
        topic: "Ownership & Borrowing",
        description: "Memory safety without garbage collection, ownership rules"
      },
      {
        topic: "Pattern Matching",
        description: "match expressions, destructuring, Option and Result types"
      },
      {
        topic: "Structs & Enums",
        description: "Custom data types, methods, associated functions"
      },
      {
        topic: "Error Handling",
        description: "Result type, panic!, unwrap(), error propagation"
      },
      {
        topic: "Concurrency",
        description: "Threads, message passing, shared state"
      },
      {
        topic: "Traits & Generics",
        description: "Code reuse, type parameters, trait bounds"
      }
    ],
    interactiveTutorials: [
      {
        name: "Rust by Example",
        url: "https://doc.rust-lang.org/rust-by-example/",
        description: "Learn Rust with interactive examples",
        free: true
      },
      {
        name: "Rustlings",
        url: "https://github.com/rust-lang/rustlings",
        description: "Small exercises to learn Rust",
        free: true
      }
    ],
    videoResources: [
      {
        name: "Rust Programming Course for Beginners",
        url: "https://www.youtube.com/watch?v=zF34dRivLOw",
        description: "Complete Rust tutorial",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "Rust Language Cheat Sheet",
        url: "https://cheats.rs/",
        description: "Comprehensive Rust reference"
      }
    ],
    community: [
      {
        name: "r/rust",
        url: "https://www.reddit.com/r/rust/",
        description: "Rust programming community"
      }
    ]
  },

  go: {
    introduction: {
      overview: "Go (Golang) is an open source programming language developed by Google. It's designed for simplicity, efficiency, and excellent support for concurrent programming, making it ideal for modern distributed systems.",
      useCases: [
        "Backend Development",
        "Microservices",
        "Cloud Computing",
        "DevOps Tools",
        "Network Programming",
        "Container Technologies"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Go Installation",
        steps: [
          "Download Go from golang.org",
          "Install and set GOPATH environment variable",
          "Verify installation: go version",
          "Install VS Code with Go extension"
        ]
      },
      firstCode: {
        title: "Your First Go Program",
        code: `package main

import "fmt"

func main() {
    // Hello World
    fmt.Println("Hello, World!")
    
    // Variables
    name := "Go" // Short variable declaration
    var year int = 2009
    isAwesome := true
    
    // Output with variables
    fmt.Printf("Welcome to %s!\\n", name)
    fmt.Printf("Go was created in %d\\n", year)
    fmt.Printf("Is Go awesome? %t\\n", isAwesome)
    
    // Function call
    greetUser("Developer")
}

func greetUser(userName string) {
    fmt.Printf("Hello, %s! Welcome to Go!\\n", userName)
}`
      }
    },
    coreConcepts: [
      {
        topic: "Goroutines & Channels",
        description: "Lightweight threads, concurrent programming, channel communication"
      },
      {
        topic: "Interfaces",
        description: "Type system, interface satisfaction, empty interface"
      },
      {
        topic: "Structs & Methods",
        description: "Custom types, method receivers, composition"
      },
      {
        topic: "Error Handling",
        description: "Error interface, error handling patterns, panic and recover"
      },
      {
        topic: "Packages & Modules",
        description: "Code organization, module system, dependency management"
      },
      {
        topic: "HTTP & Web Development",
        description: "net/http package, web servers, REST APIs"
      }
    ],
    interactiveTutorials: [
      {
        name: "A Tour of Go",
        url: "https://go.dev/tour/",
        description: "Interactive introduction to Go",
        free: true
      },
      {
        name: "Go by Example",
        url: "https://gobyexample.com/",
        description: "Hands-on introduction using annotated examples",
        free: true
      }
    ],
    videoResources: [
      {
        name: "Learn Go Programming",
        url: "https://www.youtube.com/watch?v=YS4e4q9oBaU",
        description: "Complete Go programming tutorial",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "Go Cheat Sheet",
        url: "https://devhints.io/go",
        description: "Quick Go language reference"
      }
    ],
    community: [
      {
        name: "r/golang",
        url: "https://www.reddit.com/r/golang/",
        description: "Go programming community"
      }
    ]
  },

  solidity: {
    introduction: {
      overview: "Solidity is a statically-typed curly-braces programming language designed for developing smart contracts that run on the Ethereum Virtual Machine (EVM). It's influenced by C++, Python, and JavaScript.",
      useCases: [
        "Smart Contracts",
        "Decentralized Applications (DApps)",
        "DeFi Protocols",
        "NFT Marketplaces",
        "Blockchain Games",
        "DAOs (Decentralized Autonomous Organizations)"
      ]
    },
    gettingStarted: {
      setup: {
        title: "Solidity Development Setup",
        steps: [
          "Install Node.js and npm",
          "Install Hardhat or Truffle framework",
          "Set up MetaMask wallet",
          "Use Remix IDE for online development",
          "Install VS Code with Solidity extensions"
        ]
      },
      firstCode: {
        title: "Your First Smart Contract",
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    string public message;
    address public owner;
    
    constructor() {
        message = "Hello, Blockchain World!";
        owner = msg.sender;
    }
    
    function setMessage(string memory _newMessage) public {
        require(msg.sender == owner, "Only owner can change message");
        message = _newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`
      }
    },
    coreConcepts: [
      {
        topic: "Smart Contract Basics",
        description: "Contract structure, state variables, functions, modifiers"
      },
      {
        topic: "Data Types",
        description: "uint, int, address, bytes, arrays, mappings, structs"
      },
      {
        topic: "Functions & Visibility",
        description: "public, private, internal, external, view, pure functions"
      },
      {
        topic: "Events & Logging",
        description: "Event declaration, emission, indexing, log filtering"
      },
      {
        topic: "Error Handling",
        description: "require, assert, revert, custom errors, try/catch"
      },
      {
        topic: "Gas Optimization",
        description: "Gas costs, optimization techniques, storage vs memory"
      }
    ],
    interactiveTutorials: [
      {
        name: "Remix IDE",
        url: "https://remix.ethereum.org/",
        description: "Online Solidity IDE with built-in compiler",
        free: true
      },
      {
        name: "CryptoZombies",
        url: "https://cryptozombies.io/",
        description: "Learn Solidity by building games",
        free: true
      }
    ],
    videoResources: [
      {
        name: "Solidity, Blockchain, and Smart Contract Course",
        url: "https://www.youtube.com/watch?v=M576WGiDBdQ",
        description: "Complete blockchain development course",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "Solidity Cheat Sheet",
        url: "https://docs.soliditylang.org/en/latest/cheatsheet.html",
        description: "Official Solidity language cheatsheet"
      }
    ],
    community: [
      {
        name: "r/solidity",
        url: "https://www.reddit.com/r/solidity/",
        description: "Solidity programming community"
      }
    ]
  },

  csharp: {
    introduction: {
      overview: "C# is a modern, object-oriented programming language developed by Microsoft. It's designed for building a variety of applications on the .NET platform, from web applications to desktop software.",
      useCases: [
        "Desktop Applications (WPF, WinForms)",
        "Web Development (ASP.NET)",
        "Mobile Apps (Xamarin, .NET MAUI)",
        "Game Development (Unity)",
        "Enterprise Applications",
        "Cloud Applications (Azure)"
      ]
    },
    gettingStarted: {
      setup: {
        title: ".NET SDK Installation",
        steps: [
          "Download .NET 8 SDK from dotnet.microsoft.com",
          "Install Visual Studio or VS Code with C# extension",
          "Verify installation: dotnet --version",
          "Create first project: dotnet new console"
        ]
      },
      firstCode: {
        title: "Your First C# Program",
        code: `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            // Hello World
            Console.WriteLine("Hello, World!");
            
            // Variables
            string name = "C#";
            int version = 12; // C# 12 is latest
            bool isAwesome = true;
            
            // Output with variables
            Console.WriteLine($"Welcome to {name} {version}!");
            Console.WriteLine($"Is C# awesome? {isAwesome}");
            
            // User input
            Console.Write("What's your name? ");
            string userName = Console.ReadLine();
            GreetUser(userName);
        }
        
        static void GreetUser(string userName)
        {
            Console.WriteLine($"Hello, {userName}! Welcome to C#!");
        }
    }
}`
      }
    },
    coreConcepts: [
      {
        topic: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, polymorphism, encapsulation"
      },
      {
        topic: "LINQ (Language Integrated Query)",
        description: "Query syntax, method syntax, data manipulation"
      },
      {
        topic: "Async/Await Programming",
        description: "Asynchronous programming, Task, async methods"
      },
      {
        topic: "Collections & Generics",
        description: "List<T>, Dictionary<T>, IEnumerable, generic constraints"
      },
      {
        topic: "Exception Handling",
        description: "try-catch-finally, custom exceptions, exception hierarchy"
      },
      {
        topic: "Delegates & Events",
        description: "Function pointers, event handling, lambda expressions"
      }
    ],
    interactiveTutorials: [
      {
        name: "Microsoft Learn C#",
        url: "https://docs.microsoft.com/en-us/learn/paths/csharp-first-steps/",
        description: "Official C# learning path from Microsoft",
        free: true
      },
      {
        name: ".NET Interactive Notebooks",
        url: "https://github.com/dotnet/interactive",
        description: "Interactive C# notebooks",
        free: true
      }
    ],
    videoResources: [
      {
        name: "C# Full Course for Beginners",
        url: "https://www.youtube.com/watch?v=GhQdlIFylQ8",
        description: "Complete C# programming course",
        platform: "YouTube",
        free: true
      }
    ],
    cheatSheets: [
      {
        name: "C# Reference",
        url: "https://docs.microsoft.com/en-us/dotnet/csharp/",
        description: "Official C# documentation and reference"
      }
    ],
    community: [
      {
        name: "r/csharp",
        url: "https://www.reddit.com/r/csharp/",
        description: "C# programming community"
      }
    ]
  }
};
