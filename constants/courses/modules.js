const ModulesData = {
    "cpp" : [{
        id: 1,
        title: "Introduction to C++",
        desc: "C++ is an object-oriented programming language which gives a clear structure to programs and allows code to be reused, lowering development costs.",
        lessons: ["What is C++?", "Why Learn C++?", "How to get started with C++"]

    },
    {
        id: 2,
        title: "Variables and Data Types",
        desc: "Variables are containers for storing data values.",
        lessons: ["What are Variables?", "Data Types", "Type Modifiers", "Storage Classes"]
    },
    {
        id: 3,
        title: "Loopings in C++",
        desc: "Loops are used to execute a set of statements repeatedly until a particular condition is satisfied.",
        lessons: ["What are Loops?", "For Loop", "While Loop", "Do-While Loop"]
    }
],
    "python": [
        {
            id: 1,
            title: "Introduction to Python",
            desc: "Python is an interpreted, high-level and general-purpose programming language.",
            lessons: ["What is Python?", "Python Syntax and Comments", "Variables and Data Types"]
    
        },
        {
            id: 2,
            title: "Control Statements",
            desc: "Control statements are used to control the flow of execution in a program.",
            lessons: ["What are Control Statements?", "If-Else Statements", "For Loop", "While Loop"]
        },
        {
            id: 3,
            title: "Functions in Python",
            desc: "A function is a block of organized, reusable code that is used to perform a single, related action.",
            lessons: ["What are Functions?", "Function Arguments", "Anonymous Functions", "Recursion"]
        }

    ],
    "java": [
        {
            id: 1,
            title: "Introduction to Java",
            desc: "Java is a high-level, class-based, object-oriented programming language.",
            lessons: ["What is Java?", "Why Learn Java?", "How to get started with Java"]
    
        },
        {
            id: 2,
            title: "OOPs Concepts",
            desc: "OOPs (Object-Oriented Programming) is a programming paradigm based on the concept of objects.",
            lessons: ["What are OOPs Concepts?", "Classes and Objects", "Inheritance", "Polymorphism", "Abstraction", "Encapsulation"]
        },
        {
            id: 3,
            title: "Exception Handling",
            desc: "Exception Handling is a mechanism to handle runtime errors such as ArithmeticException, NullPointerException, ArrayIndexOutOfBoundsException, etc.",
            lessons: ["What is Exception Handling?", "Try-Catch Block", "Throw and Throws", "Finally Block"]
        }
    ],
    "javascript": [
        {
            id: 1,
            title: "Introduction to JavaScript",
            desc: "JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive.",
            lessons: ["What is JavaScript?", "Why Learn JavaScript?", "How to get started with JavaScript"]
    
        },
        {
            id: 2,
            title: "Variables and Data Types",
            desc: "Variables are containers for storing data values.",
            lessons: ["What are Variables?", "What are Data Types?", "Type Modifiers", "Storage Classes"]
        },
        {
            id: 3,
            title: "Operators in JavaScript",
            desc: "Operators are used to perform operations on variables and values.",
            lessons: ["What are Operators?"]
        }
        
    ],
    "c": [
        {
            id: 1,
            title: "Introduction to C",
            desc: "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion.",
            lessons: ["What is C?", "Why Learn C?", "How to get started with C"]
    
        },
        {
            id: 2,
            title: "Variables and Data Types",
            desc: "Variables are containers for storing data values.",
            lessons: ["What are Variables?", "What are Data Types?", "Type Modifiers", "Storage Classes"]
            
        }
        
    ],

    "rust": [
        {
            id: 1,
            title: "Introduction to Rust",
            desc: "Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.",
            lessons: ["What is Rust?", "Why Learn Rust?", "Setting up Rust Environment"]
        },
        {
            id: 2,
            title: "Ownership and Borrowing",
            desc: "Rust's ownership system ensures memory safety without garbage collection through unique concepts of ownership and borrowing.",
            lessons: ["Ownership and Borrowing", "References and Lifetimes", "The Borrow Checker"]
        },
        {
            id: 3,
            title: "Structs and Enums",
            desc: "Learn how to create custom data types using structs and enums, which are fundamental building blocks in Rust.",
            lessons: ["Structs and Enums", "Pattern Matching", "Methods and Associated Functions"]
        }
    ],

    "go": [
        {
            id: 1,
            title: "Introduction to Go",
            desc: "Go (Golang) is an open-source programming language developed by Google, designed for simplicity and efficiency.",
            lessons: ["What is Go?", "Why Learn Go?", "Setting up Go Environment"]
        },
        {
            id: 2,
            title: "Goroutines and Channels",
            desc: "Learn Go's powerful concurrency features with goroutines and channels for building concurrent applications.",
            lessons: ["Goroutines and Channels", "Channel Communication", "Select Statement"]
        },
        {
            id: 3,
            title: "Web Development with Go",
            desc: "Build web applications and APIs using Go's standard library and popular frameworks.",
            lessons: ["Web Development with Go", "HTTP Handlers", "JSON APIs and Middleware"]
        }
    ],

    "solidity": [
        {
            id: 1,
            title: "Introduction to Solidity",
            desc: "Solidity is a statically-typed programming language designed for developing smart contracts on Ethereum.",
            lessons: ["What is Solidity?", "Why Learn Solidity?", "Blockchain and Smart Contracts Basics"]
        },
        {
            id: 2,
            title: "Smart Contract Basics",
            desc: "Learn the fundamental concepts of smart contract development including data types, functions, and modifiers.",
            lessons: ["Smart Contract Basics", "Data Types and Variables", "Functions and Modifiers"]
        },
        {
            id: 3,
            title: "DeFi and NFT Development",
            desc: "Build decentralized finance applications and non-fungible tokens using industry standards.",
            lessons: ["DeFi and NFT Development", "ERC-20 Tokens", "ERC-721 NFTs", "DeFi Protocols"]
        }
    ],

    "csharp": [
        {
            id: 1,
            title: "Introduction to C#",
            desc: "C# is a modern, object-oriented programming language developed by Microsoft as part of the .NET ecosystem.",
            lessons: ["What is C#?", "Why Learn C#", "Setting up .NET Environment"]
        },
        {
            id: 2,
            title: "Object-Oriented Programming",
            desc: "Master OOP concepts in C# including classes, inheritance, polymorphism, and encapsulation.",
            lessons: ["Object-Oriented Programming in C#", "Classes and Objects", "Inheritance and Polymorphism"]
        },
        {
            id: 3,
            title: "Web Development with ASP.NET Core",
            desc: "Build modern web applications and APIs using ASP.NET Core framework.",
            lessons: ["Web Development with ASP.NET Core", "Creating Web APIs", "Dependency Injection and Services"]
        }
    ]
}

export default ModulesData