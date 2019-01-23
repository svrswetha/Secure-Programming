extern crate regex;
fn main(){
	use std::io::{stdin,stdout,Write};
	use regex::Regex ;
	let re = Regex::new(r"^[a-zA-Z\s\.]*$").unwrap() ;
	let mut s=String::new();
	let _=stdout().flush();
	while true{
		s.clear() ;
		print!("Please Enter a name :") ;
		let _=stdout().flush() ;
		stdin().read_line(&mut s).expect("Did not enter a correct string");
		print!("{}", s);
		if re.is_match(&s){
			break ;
		}
		println!("Name is invalid");
		let _ =stdout().flush();
	}
	println!("Enter a operator") ;
	let _ = stdout().flush() ;
	let mut num = String::new();
	stdin().read_line(&mut num).expect("Enter a number") ;
	println!("Enter two numbers") ;
	let _ = stdout().flush() ;
	let (mut x, mut y) = (String::new(), String::new());
	print!("Enter a number : ") ;
	let _ = stdout().flush() ;
	stdin().read_line(&mut x).expect("Enter a number") ;
	print!("Enter another number :") ;
	let _ = stdout().flush() ;
	stdin().read_line(&mut y).expect("Enter a number") ;
	match num.trim().parse::<u32>().unwrap(){
		1 => println!("{}", x.trim().parse::<u32>().unwrap()+y.trim().parse::<u32>().unwrap()),
		2 => println!("{}", x.trim().parse::<u32>().unwrap()*y.trim().parse::<u32>().unwrap()) ,
		_ => println!("Invalid operator") ,
	}
}
