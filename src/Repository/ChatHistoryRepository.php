<?php

namespace App\Repository;

use App\Entity\ChatHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChatHistory>
 *
 * @method ChatHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChatHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChatHistory[]    findAll()
 * @method ChatHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChatHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatHistory::class);
    }

//    /**
//     * @return ChatHistory[] Returns an array of ChatHistory objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ChatHistory
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
