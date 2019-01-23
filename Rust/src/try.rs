
fn main() {
use std::io::{stdin,stdout,Write};

print!("Enter the name");
let _=stdout().flush();
let _name = String::new();
print!("Enter the number");
let _=stdout().flush();
let (mut num1, mut num2) = (String::new(), String::new());


let mut num = String::new();
stdin().read_line(&mut num).expect("Enter a number") ;
match num.trim().parse::<u32>().unwrap() {
	1 => println!("{}",num1.trim().parse::<u32>().unwrap() + num2.trim().parse::<u32>().unwrap()),
	2 =>println!("{}",num1.trim().parse::<u32>().unwrap() * num2.trim().parse::<u32>().unwrap()),
    _ => println!("Invalid operator"),	
}
}