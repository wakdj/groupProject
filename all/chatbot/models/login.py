import re
def validEmail(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if(re.fullmatch(regex, email)):
        return True
    return "Invalid email"

def passwordsMatch(firstPassword, secondPassword):
    if(firstPassword == secondPassword):
        return True
    return "Passwords do not match"

def validPassword(password):
    if(len(password) > 7):
        return True
    return "Password is not long enough"
