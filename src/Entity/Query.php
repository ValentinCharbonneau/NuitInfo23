<?php

namespace App\Entity;

use App\Repository\QueryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QueryRepository::class)]
#[ORM\Table(name: '`query`')]
class Query
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'queries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ChatHistory $chat = null;

    #[ORM\Column(length: 255)]
    private ?string $queryText = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $answer = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChatHistory(): ?ChatHistory
    {
        return $this->chat;
    }

    public function setChatHistory(?ChatHistory $chat): static
    {
        $this->chat = $chat;

        return $this;
    }

    public function getQueryText(): ?string
    {
        return $this->queryText;
    }

    public function setQueryText(string $queryText): static
    {
        $this->queryText = $queryText;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): static
    {
        $this->answer = $answer;

        return $this;
    }
}
