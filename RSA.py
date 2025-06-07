import math
import random
import csv

def generate_key(p, q):
    n = p * q
    phi = (p - 1) * (q - 1)

    # Choose an integer e such that e and phi(n) are coprime
    e = random.randrange(1, phi)
    gcd = math.gcd(e, phi)
    while gcd != 1:
        e = random.randrange(1, phi)
        gcd = math.gcd(e, phi)

    # Compute the private key d
    d = pow(e, -1, phi)

    # Check if public and private keys are equal
    if e == d:
        print("Please input larger prime key")
        return None, None

    # Return the public and private keys
    return ((e, n), (d, n))

def encrypt(public_key, plaintext_file=None, plaintext_string=None, ciphertext_file=None):
    if plaintext_file is not None:
        with open(plaintext_file, 'r') as file:
            plaintext = file.read()
    elif plaintext_string is not None:
        plaintext = plaintext_string
    else:
        raise ValueError("Either plaintext_file or plaintext_string must be provided.")
    
    e, n = public_key
    ciphertext = [pow(ord(char), e, n) for char in plaintext]
    
    if ciphertext_file is not None:
        with open(ciphertext_file, 'w') as file:
            file.write(str(ciphertext))
    else:
        return ciphertext


def decrypt(private_key, ciphertext_file=None, ciphertext_string=None, plaintext_file=None):
    if ciphertext_file is not None:
        with open(ciphertext_file, 'r') as file:
            ciphertext = eval(file.read())
    elif ciphertext_string is not None:
        ciphertext = eval(ciphertext_string)
    else:
        raise ValueError("Either ciphertext_file or ciphertext_string must be provided.")
    
    d, n = private_key
    plaintext = ''.join([chr(pow(char, d, n)) for char in ciphertext])
    
    if plaintext_file is not None:
        with open(plaintext_file, 'w') as file:
            file.write(plaintext)
    else:
        return plaintext
        
def encrypt_csv(public_key, input_file, output_file):
    e, n = public_key

    with open(input_file, 'r') as f:
        plaintext = f.read()
    ciphertext = [pow(ord(char), e, n) for char in plaintext]
    with open(output_file, 'w') as f:
        f.write(','.join(str(x) for x in ciphertext))
    return ciphertext
        
def decrypt_csv(private_key, input_file, output_file):
    d, n = private_key

    with open(input_file, 'r') as file:
        reader = csv.reader(file)
        ciphertext = list(reader)
    plaintext = [[chr(pow(int(char), d, n)) for char in row] for row in ciphertext]
    # Convert each integer in the plaintext to a string
    plaintext = [[str(char) for char in row] for row in plaintext]
    # Join the characters in each row with a comma
    plaintext = [''.join(row) for row in plaintext]
    
    # Write each row as a single column in the output CSV file
    with open(output_file, 'w', newline='') as file:
        writer = csv.writer(file)
        for row in plaintext:
            writer.writerow([row])


def main():
    choice = 0
    while choice != 6:
        print("==========RSA==========")
        print("Choose an option:")
        print("1. Generate Key")
        print("2. Encrypt txt")
        print("3. Decrypt txt")
        print("4. Encrypt CSV")
        print("5. Decrypt CSV")
        print("6. Exit")
        choice = int(input("Enter your choice: "))
        print()

        if choice == 1:
            p = int(input("Enter a prime number (p): "))
            q = int(input("Enter another prime number (q): "))
            public_key, private_key = generate_key(p, q)
            print("Public Key:", public_key)
            print("Private Key:", private_key)
            print()

        elif choice == 2:
            plaintext_file = input("Enter plaintext file name (or leave blank if entering plaintext): ")
            if plaintext_file:
                ciphertext_file = input("Enter ciphertext file name: ")
                e, n = input("Enter public key (e, n): ").split(",")
                public_key = (int(e), int(n))
                encrypt(public_key, plaintext_file=plaintext_file, ciphertext_file=ciphertext_file)
                print("Encryption complete.")
            else:
                plaintext_string = input("Enter plaintext: ")
                e, n = input("Enter public key (e, n): ").split(",")
                public_key = (int(e), int(n))
                ciphertext = encrypt(public_key, plaintext_string=plaintext_string)
                print("Ciphertext:", ciphertext)
            print()

        elif choice == 3:
            ciphertext_file = input("Enter ciphertext file name (or leave blank if entering ciphertext): ")
            if ciphertext_file:
                plaintext_file = input("Enter plaintext file name: ")
                d, n = input("Enter private key (d, n): ").split(",")
                private_key = (int(d), int(n))
                decrypt(private_key, ciphertext_file=ciphertext_file, plaintext_file=plaintext_file)
                print("Decryption complete.")
            else:
                ciphertext_string = input("Enter ciphertext: ")
                d, n = input("Enter private key (d, n): ").split(",")
                private_key = (int(d), int(n))
                plaintext = decrypt(private_key, ciphertext_string=ciphertext_string)
                print("Plaintext:", plaintext)
            print()
            
        elif choice == 4:
            input_file = input("Enter input file name: ")
            output_file = input("Enter output file name: ")
            e, n = input("Enter public key (e, n): ").split(",")
            public_key = (int(e), int(n))
            encrypt_csv(public_key, input_file, output_file)
            print("File encrypted successfully.")
            print()

        elif choice == 5:
            input_file = input("Enter input file name: ")
            output_file = input("Enter output file name: ")
            d, n = input("Enter private key (d, n): ").split(",")
            private_key = (int(d), int(n))
            decrypt_csv(private_key, input_file, output_file)
            print("File decrypted successfully.")
            print()

        elif choice == 6:
            print("bYE...")

        else:
            print("Invalid choice. Please try again.")
            print()


if __name__ == '__main__':
    main()