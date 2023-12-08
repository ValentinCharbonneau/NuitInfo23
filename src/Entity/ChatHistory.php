<?php

namespace App\Entity;

use App\Repository\ChatHistoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChatHistoryRepository::class)]
class ChatHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\ManyToOne(inversedBy: 'chats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'chat', targetEntity: Query::class, orphanRemoval: true)]
    private Collection $queries;

    public function __construct()
    {
        $this->queries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Query>
     */
    public function getQueries(): Collection
    {
        return $this->queries;
    }

    public function addQuery(Query $query): static
    {
        if (!$this->queries->contains($query)) {
            $this->queries->add($query);
            $query->setChatHistory($this);
        }

        return $this;
    }

    public function removeQuery(Query $query): static
    {
        if ($this->queries->removeElement($query)) {
            // set the owning side to null (unless already changed)
            if ($query->getChatHistory() === $this) {
                $query->setChatHistory(null);
            }
        }

        return $this;
    }
}
