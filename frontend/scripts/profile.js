export function editProfile()
{
	// Get references to the necessary elements
	const usernameField = document.getElementById('profile-username');
	const passwordField = document.getElementById('profile-password');
	const nicknameField = document.getElementById('profile-nickname');
	const editButton = document.getElementById('edit-button');
	const saveButton = document.getElementById('save-button');
	const cancelButton = document.getElementById('reset-button')

	const fieldsArray = [usernameField, passwordField, nicknameField];

	// Simulating fetching username from the backend
	const fetchDataFromBackend = () => {
		const data = {
			username: 'example_username',
			password: 'example_password',
			nickname: 'example_nickname',
		};
		return data;
	};

	// Function to set the initial value of the username field
	const setUserData = () => {
		const data = fetchDataFromBackend();
		usernameField.value = data.username;
		passwordField.value = data.password;
		nicknameField.value = data.nickname;
	};

	// Call the function to set initial username
	setUserData();

	// Function to toggle between edit and view modes
	const toggleEditMode = () => {
		// Toggle the disabled attribute of the username field

		// Toggle the visibility of buttons
		fieldsArray.forEach(function(element) {
			element.disabled = !element.disabled;
		});

		editButton.style.display = usernameField.disabled ? 'inline-block' : 'none';
		saveButton.style.display = usernameField.disabled ? 'none' : 'inline-block';
		cancelButton.style.display = usernameField.disabled ? 'none' : 'inline-block';

	};

	// Event listener for the edit button
	editButton.addEventListener('click', toggleEditMode);

	// Event listener for the save button
	saveButton.addEventListener('click', () => {
		// Save the updated username (here you can add your logic to save the username)
		// For demonstration, let's just log it to the console
		console.log('Updated username:', usernameField.value);

		// Toggle back to view mode
		toggleEditMode();
	});

	cancelButton.addEventListener('click', () => {
		setUserData();
		toggleEditMode();
	})

}
