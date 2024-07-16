export function handleLikes(images, totalLikes, totalLikeInfo) {
    const likeButtons = document.querySelectorAll('.like-icon');

    likeButtons.forEach((likeButton, index) => {
        let liked = false;
        const media = images[index];

        const toggleLike = () => {
            if (liked) {
                media.likes--;
                totalLikes--;
                likeButton.style.color = '#901C1C';
            } else {
                media.likes++;
                totalLikes++;
                likeButton.style.color = '#FF0000';
            }
            likeButton.previousElementSibling.innerText = media.likes.toString();
            totalLikeInfo.innerHTML = `${totalLikes} ♥`;
            liked = !liked;
        };

        likeButton.addEventListener('click', toggleLike);
        likeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                toggleLike();
            }
        });
    });
}
